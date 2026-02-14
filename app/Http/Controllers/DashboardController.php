<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeStatus;
use App\Models\Department;
use App\Models\Branch;
use App\Models\Position;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get overall dashboard statistics
     */
    public function stats(): JsonResponse
    {
        $totalEmployees = Employee::count();
        $totalCompanies = Company::count();
        $totalBranches = Branch::count();
        $totalDepartments = Department::count();
        $totalPositions = Position::count();

        // Employee status counts
        $activeEmployees = Employee::whereHas('status', function ($query) {
            $query->where('name', 'like', '%active%');
        })->count();

        // Salary statistics
        $salaryStats = Employee::select(
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(base_salary) as total_salary'),
            DB::raw('AVG(base_salary) as avg_salary'),
            DB::raw('MIN(base_salary) as min_salary'),
            DB::raw('MAX(base_salary) as max_salary')
        )->whereNotNull('base_salary')->first();

        return $this->success([
            'summary' => [
                'total_employees' => $totalEmployees,
                'total_companies' => $totalCompanies,
                'total_branches' => $totalBranches,
                'total_departments' => $totalDepartments,
                'total_positions' => $totalPositions,
            ],
            'employee_stats' => [
                'active_employees' => $activeEmployees,
                'inactive_employees' => $totalEmployees - $activeEmployees,
            ],
            'salary_stats' => [
                'employee_count_with_salary' => $salaryStats->count,
                'total_salary' => round($salaryStats->total_salary, 2),
                'average_salary' => round($salaryStats->avg_salary, 2),
                'min_salary' => round($salaryStats->min_salary, 2),
                'max_salary' => round($salaryStats->max_salary, 2),
            ]
        ], 'Dashboard statistics retrieved successfully');
    }

    /**
     * Get employee count by status
     */
    public function employeesByStatus(): JsonResponse
    {
        $statuses = EmployeeStatus::withCount('employees')->get();

        $total = $statuses->sum('employees_count');

        $data = $statuses->map(function ($status) use ($total) {
            return [
                'id' => $status->id,
                'name' => $status->name,
                'description' => $status->description,
                'employee_count' => $status->employees_count,
                'percentage' => $total > 0 ? round(($status->employees_count / $total) * 100, 2) : 0,
            ];
        });

        return $this->success([
            'employees_by_status' => $data,
            'total' => $total,
        ], 'Employees by status retrieved successfully');
    }

    /**
     * Get employee count by department with percentage
     */
    public function employeesByDepartment(): JsonResponse
    {
        $departments = Department::withCount('employees')
            ->with('company')
            ->get();

        $total = $departments->sum('employees_count');

        $data = $departments->map(function ($department) use ($total) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'company' => $department->company ? $department->company->name : null,
                'employee_count' => $department->employees_count,
                'percentage' => $total > 0 ? round(($department->employees_count / $total) * 100, 2) : 0,
            ];
        })->sortByDesc('employee_count')->values();

        return $this->success([
            'employees_by_department' => $data,
            'total' => $total,
        ], 'Employees by department retrieved successfully');
    }

    /**
     * Get employee count by branch with percentage
     */
    public function employeesByBranch(): JsonResponse
    {
        $branches = Branch::withCount('employees')
            ->with('company')
            ->get();

        $total = $branches->sum('employees_count');

        $data = $branches->map(function ($branch) use ($total) {
            return [
                'id' => $branch->id,
                'name' => $branch->name,
                'address' => $branch->address,
                'company' => $branch->company ? $branch->company->name : null,
                'employee_count' => $branch->employees_count,
                'percentage' => $total > 0 ? round(($branch->employees_count / $total) * 100, 2) : 0,
            ];
        })->sortByDesc('employee_count')->values();

        return $this->success([
            'employees_by_branch' => $data,
            'total' => $total,
        ], 'Employees by branch retrieved successfully');
    }

    /**
     * Get employee count by position with percentage
     */
    public function employeesByPosition(): JsonResponse
    {
        $positions = Position::withCount('employees')
            ->with('department', 'positionLevel')
            ->get();

        $total = $positions->sum('employees_count');

        $data = $positions->map(function ($position) use ($total) {
            return [
                'id' => $position->id,
                'title' => $position->title,
                'department' => $position->department ? $position->department->name : null,
                'level' => $position->positionLevel ? $position->positionLevel->name : null,
                'employee_count' => $position->employees_count,
                'percentage' => $total > 0 ? round(($position->employees_count / $total) * 100, 2) : 0,
            ];
        })->sortByDesc('employee_count')->values();

        return $this->success([
            'employees_by_position' => $data,
            'total' => $total,
        ], 'Employees by position retrieved successfully');
    }

    /**
     * Get recently hired employees
     */
    public function recentHires(): JsonResponse
    {
        $recentHires = Employee::with(['position', 'department', 'branch', 'status'])
            ->orderBy('hire_date', 'desc')
            ->limit(10)
            ->get();

        return $this->success([
            'recent_hires' => $recentHires,
        ], 'Recent hires retrieved successfully');
    }

    /**
     * Get monthly hiring trends for the past 12 months
     */
    public function hiringTrends(): JsonResponse
    {
        $hiringTrends = [];
        $currentDate = now();
        
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = $currentDate->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $currentDate->copy()->subMonths($i)->endOfMonth();
            
            $count = Employee::whereBetween('hire_date', [$monthStart, $monthEnd])->count();
            
            $hiringTrends[] = [
                'month' => $monthStart->format('Y-m'),
                'month_name' => $monthStart->format('F Y'),
                'employee_count' => $count,
            ];
        }

        // Calculate totals and averages
        $totalHires = collect($hiringTrends)->sum('employee_count');
        $averageHires = round($totalHires / count($hiringTrends), 2);

        return $this->success([
            'hiring_trends' => $hiringTrends,
            'summary' => [
                'total_hires' => $totalHires,
                'average_per_month' => $averageHires,
            ]
        ], 'Hiring trends retrieved successfully');
    }

    /**
     * Get salary statistics by department
     */
    public function salaryStatsByDepartment(): JsonResponse
    {
        $departments = Department::with('employees')
            ->get()
            ->map(function ($department) {
                $salaries = $department->employees->whereNotNull('base_salary');
                
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'employee_count' => $salaries->count(),
                    'total_salary' => round($salaries->sum('base_salary'), 2),
                    'average_salary' => $salaries->count() > 0 ? round($salaries->avg('base_salary'), 2) : 0,
                    'min_salary' => $salaries->min('base_salary') ?? 0,
                    'max_salary' => $salaries->max('base_salary') ?? 0,
                ];
            })
            ->sortByDesc('total_salary')
            ->values();

        return $this->success([
            'salary_by_department' => $departments,
        ], 'Salary statistics by department retrieved successfully');
    }

    /**
     * Get complete dashboard overview
     */
    public function overview(): JsonResponse
    {
        // Stats
        $totalEmployees = Employee::count();
        
        // By status
        $statuses = EmployeeStatus::withCount('employees')->get();
        $total = $statuses->sum('employees_count');
        $employeesByStatus = $statuses->map(function ($status) use ($total) {
            return [
                'name' => $status->name,
                'count' => $status->employees_count,
                'percentage' => $total > 0 ? round(($status->employees_count / $total) * 100, 2) : 0,
            ];
        });

        // By department with percentage
        $departments = Department::withCount('employees')->get();
        $totalDept = $departments->sum('employees_count');
        $employeesByDepartment = $departments->map(function ($dept) use ($totalDept) {
            return [
                'name' => $dept->name,
                'count' => $dept->employees_count,
                'percentage' => $totalDept > 0 ? round(($dept->employees_count / $totalDept) * 100, 2) : 0,
            ];
        })->sortByDesc('count')->values();

        // Recent hires
        $recentHires = Employee::with(['position', 'department'])
            ->orderBy('hire_date', 'desc')
            ->limit(5)
            ->get();

        // Hiring trends (last 6 months)
        $hiringTrends = [];
        $currentDate = now();
        
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = $currentDate->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $currentDate->copy()->subMonths($i)->endOfMonth();
            
            $count = Employee::whereBetween('hire_date', [$monthStart, $monthEnd])->count();
            
            $hiringTrends[] = [
                'month' => $monthStart->format('Y-m'),
                'month_name' => $monthStart->format('M Y'),
                'count' => $count,
            ];
        }

        // Salary summary
        $salaryStats = Employee::select(
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(base_salary) as total'),
            DB::raw('AVG(base_salary) as average')
        )->whereNotNull('base_salary')->first();

        return $this->success([
            'summary' => [
                'total_employees' => $totalEmployees,
                'total_departments' => Department::count(),
                'total_branches' => Branch::count(),
                'total_positions' => Position::count(),
            ],
            'employees_by_status' => $employeesByStatus,
            'employees_by_department' => $employeesByDepartment,
            'recent_hires' => $recentHires,
            'hiring_trends' => $hiringTrends,
            'salary_summary' => [
                'with_salary_count' => $salaryStats->count,
                'total_salary' => round($salaryStats->total, 2),
                'average_salary' => round($salaryStats->average, 2),
            ],
        ], 'Dashboard overview retrieved successfully');
    }
}

