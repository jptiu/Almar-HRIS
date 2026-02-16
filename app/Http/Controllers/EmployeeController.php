<?php

namespace App\Http\Controllers;

use App\Helpers\PasswordGenerator;
use App\Http\Requests\EmployeeRequest;
use App\Http\Resources\UserResource;
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
            'user.roles',
            'position.positionLevel',
            'department',
            'company',
            'branch',
            'status'
        ]);

        $employees = Employee::applyFilters($request, $query);

        $users = $employees->map(fn($employee) => $employee->user);

        return $this->success([
            'employees' => UserResource::collection($users)
        ], 'Employees retrieved successfully.');
    }

    /**
     * Store a newly created employee with user account.
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

            $employee->load([
                'user.roles',
                'company',
                'branch',
                'position.positionLevel'
            ]);

            DB::commit();

            return $this->created([
                'employee' => new UserResource($employee->user),
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
    public function show(Employee $employee): JsonResponse
    {
        $employee->load([
            'user.roles',
            'position.positionLevel',
            'department',
            'company',
            'branch',
            'status'
        ]);

        return $this->success([
            'employee' => new UserResource($employee->user)
        ], 'Employee retrieved successfully.');
    }

    /**
     * Update the specified employee.
     */
    public function update(EmployeeRequest $request, Employee $employee): JsonResponse
    {
        try {
            DB::beginTransaction();

            $employee->load('user.roles');
            $user = $employee->user;

            if ($request->filled('email')) {
                $user->update(['email' => $request->email]);
            }

            if ($request->filled('password')) {
                $user->update([
                    'password' => Hash::make($request->password)
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

            $employee->update($request->only([
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
            ]));

            $employee->load([
                'user.roles',
                'company',
                'branch',
                'position.positionLevel'
            ]);

            DB::commit();

            return $this->success([
                'employee' => new UserResource($employee->user)
            ], 'Employee updated successfully.');

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
     */
    public function destroy(Employee $employee): JsonResponse
    {
        try {
            DB::beginTransaction();

            $employee->load('user');

            $employee->user->delete(); // cascades if FK is set properly

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