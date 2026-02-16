<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveTypeRequest;
use App\Http\Resources\LeaveTypeResource;
use App\Models\LeaveType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeaveTypeController extends Controller
{
    /**
     * Display a listing of leave types.
     */
    public function index(Request $request): JsonResponse
    {
        $query = LeaveType::query();

        if ($request->has('active') && $request->boolean('active')) {
            $query->active();
        }

        $leaveTypes = $query->orderBy('name')->get();

        return $this->success(['leave_types' => LeaveTypeResource::collection($leaveTypes)], 'Leave types retrieved successfully.');
    }

    /**
     * Store a newly created leave type.
     */
    public function store(LeaveTypeRequest $request): JsonResponse
    {
        try {
            $leaveType = LeaveType::create($request->validated());

            return $this->created(['leave_type' => new LeaveTypeResource($leaveType)], 'Leave type created successfully.');
        } catch (\Exception $e) {
            Log::error('Leave Type Creation Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while creating the leave type.');
        }
    }

    /**
     * Display the specified leave type.
     */
    public function show(LeaveType $leaveType): JsonResponse
    {
        return $this->success(['leave_type' => new LeaveTypeResource($leaveType)], 'Leave type retrieved successfully.');
    }

    /**
     * Update the specified leave type.
     */
    public function update(LeaveTypeRequest $request, LeaveType $leaveType): JsonResponse
    {
        try {
            $leaveType->update($request->validated());

            return $this->success(['leave_type' => new LeaveTypeResource($leaveType)], 'Leave type updated successfully.');
        } catch (\Exception $e) {
            Log::error('Leave Type Update Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while updating the leave type.');
        }
    }

    /**
     * Remove the specified leave type.
     */
    public function destroy(LeaveType $leaveType): JsonResponse
    {
        try {
            // Check if there are any leave credits or requests using this type
            if ($leaveType->leaveCredits()->exists() || $leaveType->leaveRequests()->exists()) {
                // Instead of deleting, just deactivate
                $leaveType->update(['is_active' => false]);
                return $this->success(['leave_type' => new LeaveTypeResource($leaveType)], 'Leave type deactivated successfully.');
            }

            $leaveType->delete();

            return $this->success(null, 'Leave type deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Leave Type Deletion Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while deleting the leave type.');
        }
    }
}

