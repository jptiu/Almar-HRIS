<?php

namespace App\Http\Controllers;

use App\Http\Resources\LeaveRequestResource;
use App\Models\LeaveCredit;
use App\Models\LeaveRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RequestController extends Controller
{
    /**
     * List all requests (for now only leave requests) – Admin/Manager
     */
    public function index(Request $request): JsonResponse
    {
        $query = LeaveRequest::with(['employee', 'leaveType', 'reviewer'])
            ->whereNotIn('status', [LeaveRequest::STATUS_CANCELLED]);

        $leaveRequests = LeaveRequest::applyFilters($request, $query);

        return $this->success(['leave_requests' => $leaveRequests], 'Leave requests retrieved successfully.');
    }

    /**
     * Show a specific request
     */
    public function show(LeaveRequest $leaveRequest): JsonResponse
    {
        $leaveRequest->load(['employee', 'leaveType', 'reviewer']);
        return $this->success(['leave_request' => new LeaveRequestResource($leaveRequest)], 'Leave request retrieved successfully.');
    }

    /**
     * Review a request (for now only leave requests)
     */
    public function review(Request $request, LeaveRequest $leaveRequest): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($leaveRequest->status !== LeaveRequest::STATUS_PENDING) {
            return $this->error('Can only review pending leave requests.');
        }

        try {
            DB::beginTransaction();

            $user = $request->user();
            $year = $leaveRequest->start_date->year;

            if ($request->action === 'approve') {

                $leaveType = $leaveRequest->leaveType;

                // 🔥 Get existing credit (if any)
                $credit = LeaveCredit::where('employee_id', $leaveRequest->employee_id)
                    ->where('leave_type_id', $leaveRequest->leave_type_id)
                    ->where('year', $year)
                    ->first();

                // 🔥 Determine available balance (fallback to default)
                $availableDays = $credit
                    ? $credit->remaining_days
                    : $leaveType->default_days;

                if ($leaveType->default_days > 0 && $availableDays < $leaveRequest->total_days) {
                    return $this->error('Insufficient leave credits for this request.');
                }

                // 🔥 Approve request
                $leaveRequest->approve($user, $request->notes);

                // 🔥 Create credit only when needed
                if ($leaveType->default_days > 0) {

                    $credit = LeaveCredit::firstOrCreate(
                        [
                            'employee_id' => $leaveRequest->employee_id,
                            'leave_type_id' => $leaveRequest->leave_type_id,
                            'year' => $year,
                        ],
                        [
                            'total_days' => $leaveType->default_days,
                            'used_days' => 0,
                            'remaining_days' => $leaveType->default_days,
                            'notes' => 'Auto-generated on approval.',
                        ]
                    );

                    $credit->useDays($leaveRequest->total_days);
                }

                $message = 'Leave request approved successfully.';
            } else {

                // 🔥 Just reject (no credit changes)
                $leaveRequest->reject($user, $request->notes);
                $message = 'Leave request rejected successfully.';
            }

            $leaveRequest->load(['employee', 'leaveType', 'reviewer']);

            DB::commit();

            return $this->success(
                ['leave_request' => new LeaveRequestResource($leaveRequest)],
                $message
            );
        } catch (\Exception $e) {

            DB::rollBack();

            Log::error('Leave Request Review Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while reviewing the leave request.');
        }
    }
}