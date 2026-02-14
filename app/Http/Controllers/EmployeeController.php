<?php

namespace App\Http\Controllers;

use App\Helpers\PasswordGenerator;
use App\Helpers\SearchFilter;
use App\Http\Requests\EmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with([
            'user',
            'company',
            'branch',
            'department',
            'position',
            'manager',
            'status'
        ]);

        $employees = SearchFilter::for($query)
            ->search($request->query('search'))
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
     * - Always assigns "employee" role
     * - If admin + is_manager = true → assigns "employee" + "manager"
     */
    public function store(EmployeeRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $password = $request->password ?? PasswordGenerator::generate();

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($password),
                'is_active' => true,
            ]);

            $isAdmin = $request->user()
                ->roles()
                ->where('name', 'admin')
                ->exists();

            $roleNames = ['employee'];

            if ($isAdmin && $request->boolean('is_manager')) {
                $roleNames[] = 'manager';
            }

            $roleIds = Role::whereIn('name', $roleNames)->pluck('id');

            $user->roles()->syncWithoutDetaching($roleIds);

            $employee = Employee::create([
                'user_id' => $user->id,
                'created_by' => $request->user()->id,
                ...$request->only([
                    'company_id',
                    'branch_id',
                    'position_id',
                    'manager_id',
                    'employee_status_id',
                    'first_name',
                    'last_name',
                    'middle_name',
                    'address_line_1',
                    'address_line_2',
                    'city',
                    'state',
                    'postal_code',
                    'country',
                    'phone',
                    'hire_date',
                    'birthdate',
                    'base_salary',
                ])
            ]);

            $employee->load(['user', 'company', 'branch', 'position']);

            DB::commit();

            return $this->created([
                'employee' => $employee,
                'generated_password' => $password,
                'password_note' => 'Password was auto-generated. Please share this securely.',
            ], 'Employee created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Employee Creation Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while creating the employee.');
        }
    }

    /**
     * Display the specified employee.
     */
    public function show($employee): JsonResponse
    {
        $employee = Employee::with([
            'user',
            'company',
            'branch',
            'position',
            'manager',
            'creator',
            'status'
        ])->findOrFail($employee);

        return $this->success(['employee' => $employee], 'Employee retrieved successfully.');
    }

    /**
     * Update the specified employee.
     * - Admin can toggle manager role
     * - Manager cannot modify manager role
     */
    public function update(EmployeeRequest $request, $employee): JsonResponse
    {
        try {
            DB::beginTransaction();

            $employee = Employee::with('user')->findOrFail($employee);
            $user = $employee->user;

            if ($request->filled('email')) {
                $user->update([
                    'email' => $request->email,
                ]);
            }

            if ($request->filled('password')) {
                $user->update([
                    'password' => Hash::make($request->password),
                ]);
            }

            if ($request->has('is_manager')) {

                $isAdmin = $request->user()
                    ->roles()
                    ->where('name', 'admin')
                    ->exists();

                if ($isAdmin) {

                    $roleNames = ['employee'];

                    if ($request->boolean('is_manager')) {
                        $roleNames[] = 'manager';
                    }

                    $roleIds = Role::whereIn('name', $roleNames)->pluck('id');

                    $user->roles()->sync($roleIds);
                }
            }

            $employee->update(
                $request->only([
                    'company_id',
                    'branch_id',
                    'position_id',
                    'manager_id',
                    'employee_status_id',
                    'first_name',
                    'last_name',
                    'middle_name',
                    'address_line_1',
                    'address_line_2',
                    'city',
                    'state',
                    'postal_code',
                    'country',
                    'phone',
                    'hire_date',
                    'birthdate',
                    'base_salary',
                ])
            );

            $employee->load(['user', 'company', 'branch', 'position']);

            DB::commit();

            return $this->success(['employee' => $employee], 'Employee updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Employee Update Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while updating the employee.');
        }
    }

    /**
     * Remove the specified employee.
     * Only admin should be allowed via middleware/policy.
     */
    public function destroy($employee): JsonResponse
    {
        try {
            DB::beginTransaction();

            $employee = Employee::with('user')->findOrFail($employee);

            $employee->user->delete();

            DB::commit();

            return $this->success(null, 'Employee deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Employee Deletion Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while deleting the employee.');
        }
    }
}