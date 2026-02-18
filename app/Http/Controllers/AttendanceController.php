<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    /**
     * ==========================================
     * EMPLOYEE SELF-SERVICE (/me/attendance)
     * ==========================================
     */

    /**
     * Get today's attendance status.
     */
    public function todayAttendance(Request $request): JsonResponse
    {
        $employee = $request->user()->employee;

        if (!$employee) {
            return $this->notFound('Employee profile not found.');
        }

        $today = now()->toDateString();

        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance) {
            return $this->success([
                'has_clocked_in' => false,
                'has_clocked_out' => false,
                'status' => 'not_started',
                'date' => $today,
                'message' => 'You have not started your attendance yet.',
            ], 'Today attendance status retrieved.');
        }

        return $this->success([
            'id' => $attendance->id,
            'date' => $attendance->date->toDateString(),
            'clock_in' => $attendance->clock_in ? $attendance->clock_in->format('H:i:s') : null,
            'clock_out' => $attendance->clock_out ? $attendance->clock_out->format('H:i:s') : null,
            'clock_in_datetime' => $attendance->clock_in_datetime?->toIso8601String(),
            'clock_out_datetime' => $attendance->clock_out_datetime?->toIso8601String(),
            'has_clocked_in' => $attendance->clock_in !== null,
            'has_clocked_out' => $attendance->clock_out !== null,
            'status' => $attendance->status,
            'hours_worked' => $attendance->hours_worked,
            'formatted_hours_worked' => $attendance->formatted_hours_worked,
            'is_late' => $attendance->status === Attendance::STATUS_LATE,
            'late_minutes' => $attendance->getLateDurationInMinutes(),
            'notes' => $attendance->notes,
        ], 'Today attendance status retrieved.');
    }

    /**
     * Clock in for the day.
     */
    public function clockIn(AttendanceRequest $request): JsonResponse
    {
        try {
            $employee = $request->user()->employee;

            if (!$employee) {
                return $this->notFound('Employee profile not found.');
            }

            $timezone = $request->header('X-Timezone');
            $localTime = now()->setTimezone($timezone);
            $today = $localTime->toDateString();
            $now = now(); // UTC timestamp for database

            // Check if already clocked in today
            $existingAttendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('date', $today)
                ->first();

            if ($existingAttendance && $existingAttendance->clock_in) {
                return $this->conflict('You have already clocked in today.');
            }

            // Correct work start time with today's date in user timezone
            $workStartTime = Carbon::today($timezone)
                ->setTimeFromTimeString(Attendance::DEFAULT_WORK_START);

            // Determine status
            if ($localTime->lte($workStartTime)) {
                $status = Attendance::STATUS_PRESENT;
                $lateMinutes = 0;
            } else {
                $status = Attendance::STATUS_LATE;
                $lateMinutes = $localTime->diffInMinutes($workStartTime);
            }

            // Get client IP address
            $ipAddress = $request->ip();

            // Create or update attendance record
            $attendance = Attendance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'date' => $today,
                ],
                [
                    'clock_in' => $localTime->format('H:i:s'),
                    'clock_in_datetime' => $now,
                    'status' => $status,
                    'clock_in_latitude' => $request->latitude,
                    'clock_in_longitude' => $request->longitude,
                    'clock_in_ip_address' => $ipAddress,
                    'notes' => $request->notes,
                ]
            );

            return $this->created([
                'id' => $attendance->id,
                'date' => $attendance->date->toDateString(),
                'clock_in' => $attendance->clock_in,
                'clock_in_datetime' => $attendance->clock_in_datetime->toIso8601String(),
                'status' => $attendance->status,
                'is_late' => $status === Attendance::STATUS_LATE,
                'late_minutes' => $lateMinutes,
                'message' => $status === Attendance::STATUS_LATE
                    ? "You clocked in {$lateMinutes} minutes late."
                    : 'You clocked in on time. Good morning!',
            ], $status === Attendance::STATUS_LATE
                ? "Clocked in late by {$lateMinutes} minutes."
                : 'Clocked in successfully.');
        } catch (\Exception $e) {
            Log::error('Clock In Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while clocking in.');
        }
    }

    /**
     * Clock out for the day.
     */
    public function clockOut(AttendanceRequest $request): JsonResponse
    {
        try {
            $employee = $request->user()->employee;

            if (!$employee) {
                return $this->notFound('Employee profile not found.');
            }

            $timezone = $request->header('X-Timezone');
            $localTime = now()->setTimezone($timezone);
            $today = $localTime->toDateString();
            $now = now(); // UTC timestamp for DB

            // Find today's attendance record (based on employee local date)
            $attendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('date', $today)
                ->first();

            if (!$attendance || !$attendance->clock_in_datetime) {
                return $this->error('You have not clocked in today.');
            }

            if ($attendance->clock_out_datetime) {
                return $this->conflict('You have already clocked out today.');
            }

            // Parse clock in datetime (stored in UTC)
            $clockInUtc = Carbon::parse($attendance->clock_in_datetime);
            $clockOutUtc = $now;

            if ($clockOutUtc->lessThan($clockInUtc)) {
                return $this->error('Clock out time cannot be earlier than clock in.');
            }

            // Calculate worked minutes
            $totalMinutes = $clockInUtc->diffInMinutes($clockOutUtc);
            $hoursWorked = round($totalMinutes / 60, 2);

            // Format hours & minutes
            $hours = floor($totalMinutes / 60);
            $minutes = $totalMinutes % 60;

            // Get client IP address
            $ipAddress = $request->ip();

            // Update attendance record
            $attendance->update([
                'clock_out' => $localTime->format('H:i:s'), // store local time display
                'clock_out_datetime' => $clockOutUtc, // store UTC
                'hours_worked' => $hoursWorked,
                'clock_out_latitude' => $request->latitude,
                'clock_out_longitude' => $request->longitude,
                'clock_out_ip_address' => $ipAddress,
            ]);

            return $this->success([
                'id' => $attendance->id,
                'date' => $attendance->date->toDateString(),
                'clock_in' => $attendance->clock_in,
                'clock_out' => $attendance->clock_out,
                'clock_in_datetime' => $attendance->clock_in_datetime->toIso8601String(),
                'clock_out_datetime' => $attendance->clock_out_datetime->toIso8601String(),
                'status' => $attendance->status,
                'hours_worked' => $hoursWorked,
                'formatted_hours_worked' => "{$hours}h {$minutes}m",
                'message' => "Great work today! You worked for {$hours}h {$minutes}m.",
            ], 'Clocked out successfully.');
        } catch (\Exception $e) {
            Log::error('Clock Out Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while clocking out.');
        }
    }

    /**
     * Get my attendance history.
     */
    public function myAttendance(Request $request): JsonResponse
    {
        $employee = $request->user()->employee;

        if (!$employee) {
            return $this->notFound('Employee profile not found.');
        }

        $query = Attendance::where('employee_id', $employee->id)
            ->orderBy('date', 'desc');

        // Apply date filters if provided
        if ($request->has('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Apply filters using the SearchFilter trait
        $paginated = Attendance::applyFilters($request, $query);

        $paginated->getCollection()->transform(function ($record) {
            return [
                'id' => $record->id,
                'date' => $record->date->toDateString(),
                'clock_in' => $record->clock_in ? $record->clock_in->format('H:i:s') : null,
                'clock_out' => $record->clock_out ? $record->clock_out->format('H:i:s') : null,
                'clock_in_datetime' => $record->clock_in_datetime?->toIso8601String(),
                'clock_out_datetime' => $record->clock_out_datetime?->toIso8601String(),
                'status' => $record->status,
                'hours_worked' => $record->hours_worked,
                'formatted_hours_worked' => $record->formatted_hours_worked,
                'is_late' => $record->status === Attendance::STATUS_LATE,
                'late_minutes' => $record->getLateDurationInMinutes(),
                'notes' => $record->notes,
            ];
        });

        // Calculate summary
        $totalDays = $paginated->total();
        $presentDays = $paginated->getCollection()->whereIn('status', [Attendance::STATUS_PRESENT, Attendance::STATUS_LATE])->count();
        $lateDays = $paginated->getCollection()->where('status', Attendance::STATUS_LATE)->count();
        $totalHours = $paginated->getCollection()->sum('hours_worked');

        return $this->success([
            'attendances' => $paginated,
            'summary' => [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'late_days' => $lateDays,
                'total_hours' => round($totalHours, 2),
                'average_hours_per_day' => $presentDays > 0 ? round($totalHours / $presentDays, 2) : 0,
            ],
        ], 'Attendance history retrieved successfully.');
    }

    /**
     * ==========================================
     * ADMIN/MANAGER ATTENDANCE MANAGEMENT
     * ==========================================
     */

    /**
     * List all attendance records (Admin/Manager).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['employee', 'leaveRequest'])
            ->orderBy('date', 'desc')
            ->orderBy('clock_in', 'desc');

        $paginated = Attendance::applyFilters($request, $query);

        $paginated->getCollection()->transform(function ($record) {
            return [
                'id' => $record->id,
                'employee_id' => $record->employee_id,
                'employee_name' => $record->employee->first_name . ' ' . $record->employee->last_name,
                'date' => $record->date->toDateString(),
                'clock_in' => $record->clock_in ? $record->clock_in->format('H:i:s') : null,
                'clock_out' => $record->clock_out ? $record->clock_out->format('H:i:s') : null,
                'clock_in_datetime' => $record->clock_in_datetime?->toIso8601String(),
                'clock_out_datetime' => $record->clock_out_datetime?->toIso8601String(),
                'status' => $record->status,
                'hours_worked' => $record->hours_worked,
                'formatted_hours_worked' => $record->formatted_hours_worked,
                'is_late' => $record->status === Attendance::STATUS_LATE,
                'late_minutes' => $record->getLateDurationInMinutes(),
                'notes' => $record->notes,
                'created_at' => $record->created_at->toIso8601String(),
            ];
        });

        // Calculate summary statistics
        $totalRecords = $paginated->total();
        $presentCount = $paginated->getCollection()->whereIn('status', [Attendance::STATUS_PRESENT, Attendance::STATUS_LATE])->count();
        $lateCount = $paginated->getCollection()->where('status', Attendance::STATUS_LATE)->count();
        $absentCount = $paginated->getCollection()->where('status', Attendance::STATUS_ABSENT)->count();
        $onLeaveCount = $paginated->getCollection()->where('status', Attendance::STATUS_ON_LEAVE)->count();
        $totalHours = $paginated->getCollection()->sum('hours_worked');

        return $this->success([
            'attendances' => $paginated,
            'summary' => [
                'total_records' => $totalRecords,
                'present_count' => $presentCount,
                'late_count' => $lateCount,
                'absent_count' => $absentCount,
                'on_leave_count' => $onLeaveCount,
                'total_hours' => round($totalHours, 2),
            ],
        ], 'All attendance records retrieved successfully.');
    }

    /**
     * Show specific employee's attendance (Admin/Manager).
     */
    public function showEmployeeAttendance(Request $request, Employee $employee): JsonResponse
    {
        $query = Attendance::where('employee_id', $employee->id)
            ->orderBy('date', 'desc');

        // Apply date filters if provided
        if ($request->has('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $paginated = Attendance::applyFilters($request, $query);

        $paginated->getCollection()->transform(function ($record) {
            return [
                'id' => $record->id,
                'date' => $record->date->toDateString(),
                'clock_in' => $record->clock_in ? $record->clock_in->format('H:i:s') : null,
                'clock_out' => $record->clock_out ? $record->clock_out->format('H:i:s') : null,
                'clock_in_datetime' => $record->clock_in_datetime?->toIso8601String(),
                'clock_out_datetime' => $record->clock_out_datetime?->toIso8601String(),
                'status' => $record->status,
                'hours_worked' => $record->hours_worked,
                'formatted_hours_worked' => $record->formatted_hours_worked,
                'is_late' => $record->status === Attendance::STATUS_LATE,
                'late_minutes' => $record->getLateDurationInMinutes(),
                'notes' => $record->notes,
            ];
        });

        // Calculate summary for this employee
        $totalDays = $paginated->total();
        $presentDays = $paginated->getCollection()->whereIn('status', [Attendance::STATUS_PRESENT, Attendance::STATUS_LATE])->count();
        $lateDays = $paginated->getCollection()->where('status', Attendance::STATUS_LATE)->count();
        $totalHours = $paginated->getCollection()->sum('hours_worked');

        return $this->success([
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->first_name . ' ' . $employee->last_name,
            ],
            'attendances' => $paginated,
            'summary' => [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'late_days' => $lateDays,
                'total_hours' => round($totalHours, 2),
                'average_hours_per_day' => $presentDays > 0 ? round($totalHours / $presentDays, 2) : 0,
            ],
        ], 'Employee attendance retrieved successfully.');
    }

    /**
     * Get today's attendance overview (Admin/Manager).
     */
    public function todayOverview(): JsonResponse
    {
        $today = now()->toDateString();

        $attendances = Attendance::with(['employee'])
            ->whereDate('date', $today)
            ->get()
            ->transform(function ($record) {
                return [
                    'id' => $record->id,
                    'employee_id' => $record->employee_id,
                    'employee_name' => $record->employee->first_name . ' ' . $record->employee->last_name,
                    'clock_in' => $record->clock_in ? $record->clock_in->format('H:i:s') : null,
                    'clock_out' => $record->clock_out ? $record->clock_out->format('H:i:s') : null,
                    'status' => $record->status,
                    'hours_worked' => $record->hours_worked,
                    'is_late' => $record->status === Attendance::STATUS_LATE,
                ];
            });

        $totalEmployees = $attendances->count();
        $presentCount = $attendances->whereIn('status', [Attendance::STATUS_PRESENT, Attendance::STATUS_LATE])->count();
        $lateCount = $attendances->where('status', Attendance::STATUS_LATE)->count();
        $onLeaveCount = $attendances->where('status', Attendance::STATUS_ON_LEAVE)->count();
        $notStartedCount = $totalEmployees - $presentCount - $onLeaveCount;

        return $this->success([
            'date' => $today,
            'attendances' => $attendances,
            'summary' => [
                'total_employees' => $totalEmployees,
                'present' => $presentCount,
                'late_count' => $lateCount,
                'on_leave_count' => $onLeaveCount,
                'not_started_count' => $notStartedCount,
            ],
        ], 'Today attendance overview retrieved successfully.');
    }
}
