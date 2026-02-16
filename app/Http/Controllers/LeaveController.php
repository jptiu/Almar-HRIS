<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveCreditRequest;
use App\Http\Requests\LeaveRequestValidation;
use App\Http\Resources\LeaveCreditResource;
use App\Http\Resources\LeaveRequestResource;
use App\Models\Employee;
use App\Models\LeaveCredit;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class LeaveController extends Controller
{
    /**
     * ==========================================
     * EMPLOYEE SELF-SERVICE (/me/leave)
     * ==========================================
     */
    public function myLeaveCredits(Request $request): JsonResponse
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return $this->notFound('Employee profile not found.');
        }

        $year = (int) $request->query('year', now()->year);
        $leaveData = $this->computeEmployeeLeaveCredits($employee, $year);

        return $this->success([
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'email' => $employee->user->email ?? null,
                'company' => $employee->company->name ?? null,
                'branch' => $employee->branch->name ?? null,
                'department' => $employee->department->name ?? null,
                'position' => $employee->position->title ?? null,
            ],
            'credits' => $leaveData['credits'],
            'summary' => $leaveData['summary'],
        ], 'Leave credits retrieved successfully.');
    }

    public function myLeaveRequests(Request $request): JsonResponse
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return $this->notFound('Employee profile not found.');
        }

        $query = LeaveRequest::where('employee_id', $employee->id)
            ->with(['leaveType', 'reviewer']);

        $leaveRequests = LeaveRequest::applyFilters($request, $query);

        return $this->success(['leave_requests' => $leaveRequests], 'Leave requests retrieved successfully.');
    }

    public function submitLeaveRequest(LeaveRequestValidation $request): JsonResponse
    {
        try {
            $employee = $request->user()->employee;

            if (!$employee) {
                return $this->notFound('Employee profile not found.');
            }

            $validated = $request->validated();

            $startDate = Carbon::parse($validated['start_date'])->startOfDay();
            $endDate = Carbon::parse($validated['end_date'])->startOfDay();

            if ($startDate->gt($endDate)) {
                return $this->error('End date must be after or equal to start date.');
            }

            $totalDays = $startDate->diffInDays($endDate) + 1;
            $year = $startDate->year;

            $leaveType = LeaveType::find($validated['leave_type_id']);

            if (!$leaveType) {
                return $this->notFound('Leave type not found.');
            }

            $status = !$leaveType->requires_approval
                ? LeaveRequest::STATUS_APPROVED
                : LeaveRequest::STATUS_PENDING;

            // 🔥 Get existing credit (if any)
            $credit = LeaveCredit::where('employee_id', $employee->id)
                ->where('leave_type_id', $leaveType->id)
                ->where('year', $year)
                ->first();

            // 🔥 Determine available balance (fallback to default)
            $availableDays = $credit
                ? $credit->remaining_days
                : $leaveType->default_days;

            if ($leaveType->default_days > 0 && $availableDays < $totalDays) {
                return $this->error('Insufficient leave credits for this request.');
            }

            DB::beginTransaction();

            $leaveRequest = LeaveRequest::create([
                'employee_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_days' => $totalDays,
                'reason' => $validated['reason'] ?? null,
                'status' => $status,
            ]);

            // 🔥 If auto-approved, create/update credit immediately
            if ($status === LeaveRequest::STATUS_APPROVED && $leaveType->default_days > 0) {

                $credit = LeaveCredit::firstOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'leave_type_id' => $leaveType->id,
                        'year' => $year,
                    ],
                    [
                        'total_days' => $leaveType->default_days,
                        'used_days' => 0,
                        'remaining_days' => $leaveType->default_days,
                        'notes' => 'Auto-generated on first approved leave.',
                    ]
                );

                $credit->useDays($totalDays);
            }

            $leaveRequest->load('leaveType');

            DB::commit();

            return $this->created(
                ['leave_request' => new LeaveRequestResource($leaveRequest)],
                $status === LeaveRequest::STATUS_APPROVED
                    ? 'Leave request approved automatically.'
                    : 'Leave request submitted successfully.'
            );
        } catch (\Exception $e) {

            DB::rollBack();

            Log::error('Leave Request Submission Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while submitting the leave request.');
        }
    }

    public function cancelMyLeaveRequest(Request $request, LeaveRequest $leaveRequest): JsonResponse
    {
        $employee = $request->user()->employee;
        if (!$employee) {
            return $this->notFound('Employee profile not found.');
        }

        // Verify ownership
        if ($leaveRequest->employee_id !== $employee->id) {
            return $this->forbidden('You can only cancel your own leave requests.');
        }

        try {
            DB::beginTransaction();

            // Cancel the request using the model helper
            $leaveRequest->cancel();

            DB::commit();

            return $this->success(
                ['leave_request' => new LeaveRequestResource($leaveRequest)],
                'Leave request cancelled successfully.'
            );
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Leave Request Cancellation Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            // Return a friendly message to the API
            return $this->error($e->getMessage());
        }
    }

    /**
     * ==========================================
     * ADMIN/MANAGER LEAVE MANAGEMENT
     * ==========================================
     */
    public function index(Request $request): JsonResponse
    {
        $query = LeaveRequest::with(['employee', 'leaveType', 'reviewer'])
            ->whereNotIn('status', [LeaveRequest::STATUS_CANCELLED]);

        $leaveRequests = LeaveRequest::applyFilters($request, $query);

        return $this->success(['leave_requests' => $leaveRequests], 'Leave requests retrieved successfully.');
    }

    public function show(LeaveRequest $leaveRequest): JsonResponse
    {
        $leaveRequest->load(['employee', 'leaveType', 'reviewer']);
        return $this->success(['leave_request' => new LeaveRequestResource($leaveRequest)], 'Leave request retrieved successfully.');
    }

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

    public function allEmployeesLeaveCredits(Request $request): JsonResponse
    {
        $year = (int) $request->query('year', now()->year);

        $query = Employee::with([
            'user:id,email',
            'company:id,name',
            'branch:id,name',
            'department:id,name',
            'position:id,title',
        ]);

        $paginated = Employee::applyFilters($request, $query);

        $paginated->getCollection()->transform(function ($employee) use ($year) {
            $leaveData = $this->computeEmployeeLeaveCredits($employee, $year);

            return [
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'email' => $employee->user->email ?? null,
                    'company' => $employee->company->name ?? null,
                    'branch' => $employee->branch->name ?? null,
                    'department' => $employee->department->name ?? null,
                    'position' => $employee->position->title ?? null,
                ],
                'credits' => $leaveData['credits'],
                'summary' => $leaveData['summary'],
            ];
        });

        return $this->success(
            ['leave_credits_summary' => $paginated],
            'All employees leave credits summary retrieved successfully.'
        );
    }

    public function employeeLeaveCredits(Request $request, Employee $employee): JsonResponse
    {
        $year = (int) $request->query('year', now()->year);
        $leaveData = $this->computeEmployeeLeaveCredits($employee, $year);

        return $this->success([
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'email' => $employee->user->email ?? null,
                'company' => $employee->company->name ?? null,
                'branch' => $employee->branch->name ?? null,
                'department' => $employee->department->name ?? null,
                'position' => $employee->position->title ?? null,
            ],
            'credits' => $leaveData['credits'],
            'summary' => $leaveData['summary'],
        ], 'Employee leave credits retrieved successfully.');
    }

    public function adjustLeaveCredits(Request $request, Employee $employee): JsonResponse
    {
        $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'year' => 'required|integer|min:2000|max:2100',
            'adjustment' => 'required|numeric|min:0',       // always positive
            'action' => 'required|in:add,subtract',        // adjustment direction
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Determine actual adjustment
            $adjustment = $request->adjustment * ($request->action === 'subtract' ? -1 : 1);

            // Fetch leave type default days
            $leaveType = LeaveType::findOrFail($request->leave_type_id);
            $defaultDays = (float) $leaveType->default_days;

            // Fetch existing leave credit
            $credit = LeaveCredit::firstWhere([
                'employee_id' => $employee->id,
                'leave_type_id' => $request->leave_type_id,
                'year' => $request->year,
            ]);

            if (!$credit) {
                if ($adjustment < 0) {
                    return $this->error('Cannot subtract from non-existent leave credit.');
                }

                // Create new credit with default + adjustment
                $totalDays = $defaultDays + $adjustment;

                $credit = LeaveCredit::create([
                    'employee_id' => $employee->id,
                    'leave_type_id' => $request->leave_type_id,
                    'year' => $request->year,
                    'total_days' => $totalDays,
                    'used_days' => 0,
                    'remaining_days' => $totalDays,
                    'notes' => $request->notes,
                ]);
            } else {
                // Adjust existing credit
                $newTotal = $credit->total_days + $adjustment;

                if ($newTotal < 0) {
                    return $this->error('Adjustment would result in negative total days.');
                }

                $credit->total_days = $newTotal;
                $credit->remaining_days = max(0, $credit->total_days - $credit->used_days);

                if ($request->notes) {
                    $credit->notes = ($credit->notes ? $credit->notes . ' | ' : '') . $request->notes;
                }

                $credit->save();
            }

            $credit->load('leaveType');

            DB::commit();

            // Use helper to return consistent credits + summary
            $leaveData = $this->computeEmployeeLeaveCredits($employee, $credit->year);

            return $this->success([
                'leave_credit' => [
                    'leave_type_id' => $credit->leave_type_id,
                    'leave_type_name' => $credit->leaveType->name ?? null,
                    'credits' => $leaveData['credits'],
                    'summary' => $leaveData['summary'],
                ]
            ], 'Leave credits adjusted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Leave Credits Adjustment Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->serverError('An error occurred while adjusting leave credits.');
        }
    }

    private function computeEmployeeLeaveCredits(Employee $employee, int $year): array
    {
        // Get all active leave types
        $leaveTypes = LeaveType::where('is_active', true)->get();

        // Get employee leave credits for the year
        $leaveCredits = LeaveCredit::where('employee_id', $employee->id)
            ->where('year', $year)
            ->get()
            ->keyBy('leave_type_id');

        $credits = [];
        $totalCredits = 0;
        $totalUsed = 0;
        $totalRemaining = 0;

        foreach ($leaveTypes as $type) {
            $credit = $leaveCredits->get($type->id);

            if ($credit) {
                $totalDays = (float) $credit->total_days;
                $usedDays = (float) $credit->used_days;
                $remainingDays = (float) $credit->remaining_days;
            } else {
                $totalDays = (float) $type->default_days;
                $usedDays = 0.0;
                $remainingDays = (float) $type->default_days;
            }

            $totalCredits += $totalDays;
            $totalUsed += $usedDays;
            $totalRemaining += $remainingDays;

            $credits[] = [
                'leave_type_id' => $type->id,
                'leave_type_name' => $type->name,
                'description' => $type->description,
                'total_days' => $totalDays,
                'used_days' => $usedDays,
                'remaining_days' => $remainingDays,
                'requires_approval' => (bool) $type->requires_approval,
                'year' => $year,
            ];
        }

        return [
            'credits' => $credits,
            'summary' => [
                'total_credits' => $totalCredits,
                'total_used' => $totalUsed,
                'total_remaining' => $totalRemaining,
                'year' => $year,
            ],
        ];
    }
}
