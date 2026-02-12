<?php

namespace App\Http\Controllers;

use App\Helpers\PasswordGenerator;
use App\Helpers\SearchFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with(['user', 'company', 'branch', 'department', 'position', 'manager', 'status']);

        $employees = SearchFilter::for($query)
            ->search($request->query('search')) // automatically searches all $searchable fields
            ->filters([
                'company_id' => $request->query('company_id'),
                'branch_id' => $request->query('branch_id'),
                'department_id' => $request->query('department_id'),
                'position_id' => $request->query('position_id'),
                'manager_id' => $request->query('manager_id'),
                'employee_status_id' => $request->query('employee_status_id'),
            ])
            ->sort(
                $request->query('sort_field', 'created_at'),
                $request->query('sort_order', 'desc')
            )
            ->paginate((int) $request->query('per_page', 20));

        return $this->success(['employees' => $employees], 'Employees retrieved successfully.');
    }

    /**
     * Store a newly created employee with user account.
     * Creates employee with "employee" or "manager" role based on is_manager flag (admin only).
     * Managers can create employees but cannot assign manager role.
     * Password is auto-generated if not provided.
     */
    public function store(EmployeeRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Generate password if not provided
            $password = $request->password ?? PasswordGenerator::generate();

            // Create user
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($password),
                'is_active' => true,
            ]);

            // Determine role based on is_manager flag (admin only)
            // Managers can create employees but cannot assign manager role
            $isAdmin = $request->user()->roles()->where('name', 'admin')->exists();
            $roleName = ($isAdmin && $request->is_manager) ? 'manager' : 'employee';
            $roleId = DB::table('roles')->where('name', $roleName)->value('id');

            if ($roleId) {
                DB::table('user_roles')->insert([
                    'user_id' => $user->id,
                    'role_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Create employee record
            $employee = Employee::create([
                'user_id' => $user->id,
                'created_by' => $request->user()->id,
                'company_id' => $request->company_id,
                'branch_id' => $request->branch_id,
                'position_id' => $request->position_id,
                'manager_id' => $request->manager_id,
                'employee_status_id' => $request->employee_status_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_name' => $request->middle_name,
                'address_line_1' => $request->address_line_1,
                'address_line_2' => $request->address_line_2,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'phone' => $request->phone,
                'hire_date' => $request->hire_date,
                'birthdate' => $request->birthdate,
                'base_salary' => $request->base_salary,
            ]);

            $employee->load(['user', 'company', 'branch', 'position']);

            DB::commit();

            return $this->created([
                'employee' => $employee,
                'generated_password' => $password,
                'password_note' => 'Password was auto-generated. Please share this with the employee securely.',
            ], 'Employee created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            \Illuminate\Support\Facades\Log::error('Employee Creation Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while creating the employee.');
        }
    }

    /**
     * Display the specified employee.
     */
    public function show($employee): JsonResponse
    {
        $employee = Employee::with(['user', 'company', 'branch', 'position', 'manager', 'creator', 'status'])
            ->findOrFail($employee);

        return $this->success(['employee' => $employee], 'Employee retrieved successfully.');
    }

    /**
     * Update the specified employee.
     * Also updates user role based on is_manager flag (admin only).
     * Managers can update employees but cannot change manager role.
     */
    public function update(EmployeeRequest $request, $employee): JsonResponse
    {
        try {
            $employee = Employee::findOrFail($employee);

            DB::beginTransaction();

            // Update user email if provided
            if ($request->has('email')) {
                $employee->user->update([
                    'email' => $request->email,
                ]);
            }

            // Update user password if provided
            if ($request->has('password') && $request->password) {
                $employee->user->update([
                    'password' => Hash::make($request->password),
                ]);
            }

            // Update role if is_manager is provided (admin only)
            // Managers can update employees but cannot change manager role
            if ($request->has('is_manager')) {
                $isAdmin = $request->user()->roles()->where('name', 'admin')->exists();

                if ($isAdmin) {
                    // Remove existing roles
                    DB::table('user_roles')->where('user_id', $employee->user->id)->delete();

                    // Assign new role based on is_manager flag
                    $roleName = $request->is_manager ? 'manager' : 'employee';
                    $roleId = DB::table('roles')->where('name', $roleName)->value('id');

                    if ($roleId) {
                        DB::table('user_roles')->insert([
                            'user_id' => $employee->user->id,
                            'role_id' => $roleId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            // Update employee record
            $employee->update([
                'company_id' => $request->company_id ?? $employee->company_id,
                'branch_id' => $request->branch_id ?? $employee->branch_id,
                'position_id' => $request->position_id ?? $employee->position_id,
                'manager_id' => $request->manager_id ?? $employee->manager_id,
                'employee_status_id' => $request->employee_status_id ?? $employee->employee_status_id,
                'first_name' => $request->first_name ?? $employee->first_name,
                'last_name' => $request->last_name ?? $employee->last_name,
                'middle_name' => $request->middle_name ?? $employee->middle_name,
                'address_line_1' => $request->address_line_1 ?? $employee->address_line_1,
                'address_line_2' => $request->address_line_2 ?? $employee->address_line_2,
                'city' => $request->city ?? $employee->city,
                'state' => $request->state ?? $employee->state,
                'postal_code' => $request->postal_code ?? $employee->postal_code,
                'country' => $request->country ?? $employee->country,
                'phone' => $request->phone ?? $employee->phone,
                'hire_date' => $request->hire_date ?? $employee->hire_date,
                'birthdate' => $request->birthdate ?? $employee->birthdate,
                'base_salary' => $request->base_salary ?? $employee->base_salary,
            ]);

            $employee->load(['user', 'company', 'branch', 'position']);

            DB::commit();

            return $this->success(['employee' => $employee], 'Employee updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            \Illuminate\Support\Facades\Log::error('Employee Update Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while updating the employee.');
        }
    }

    /**
     * Remove the specified employee.
     * Only admin can delete employees.
     */
    public function destroy($employee): JsonResponse
    {
        $employee = Employee::findOrFail($employee);

        try {
            DB::beginTransaction();

            // Delete user (will cascade delete employee due to foreign key)
            $employee->user->delete();

            DB::commit();

            return $this->success(null, 'Employee deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            \Illuminate\Support\Facades\Log::error('Employee Deletion Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while deleting the employee.');
        }
    }
}
