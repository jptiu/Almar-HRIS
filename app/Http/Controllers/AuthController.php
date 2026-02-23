<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserLoginResource;
use App\Http\Requests\UpdateMyProfileRequest;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return $this->unauthorized('Invalid credentials');
            }

            Auth::login($user);
            $request->session()->regenerate();

            // Load relationships
            $user->load([
                'roles',
                'employee.position',
                'employee.department',
                'employee.branch',
                'employee.company',
                'employee.status'
            ]);

            if ($user->hasRole('employee')) {
                $user->setActiveRole('employee');
            } else {
                $user->setActiveRole($user->roles->first()?->name);
            }

            return $this->success([
                'user' => new UserLoginResource($user),
                'active_role' => session('active_role')
            ], 'Login successful');
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred during login');
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->forget('active_role');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logged out successfully');
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user()->load([
            'roles',
            'employee.position',
            'employee.department',
            'employee.branch',
            'employee.company',
            'employee.status'
        ]);

        return $this->success([
            'user' => new UserResource($user),
            'active_role' => $user->getActiveRole(),
        ], 'User retrieved successfully');
    }

    /**
     * Switch active role
     */
    public function switchRole(Request $request)
    {
        $request->validate([
            'role' => 'required|string'
        ]);

        $user = $request->user();

        if (!$user->hasRole($request->role)) {
            return response()->json([
                'message' => 'You do not have this role.'
            ], 403);
        }

        $user->setActiveRole($request->role);

        return $this->success([
            'active_role' => $user->getActiveRole()
        ], 'Role switched successfully');
    }

    /**
     * Update current user's profile
     */
    public function updateProfile(UpdateMyProfileRequest $request)
    {
        try {
            $user = $request->user();
            $validated = $request->validated();

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            if (isset($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            if ($user->employee) {
                $employeeFields = [
                    'first_name',
                    'middle_name',
                    'last_name',
                    'phone',
                    'birthdate',
                    'address_line_1',
                    'address_line_2',
                    'city',
                    'state',
                    'postal_code',
                    'country',
                ];

                foreach ($employeeFields as $field) {
                    if (isset($validated[$field])) {
                        $user->employee->{$field} = $validated[$field];
                    }
                }

                $user->employee->save();
            }

            $user->load([
                'roles',
                'employee.position',
                'employee.department',
                'employee.branch',
                'employee.company',
                'employee.status'
            ]);

            return $this->success(new UserResource($user), 'Profile updated successfully');
        } catch (\Exception $e) {
            Log::error('Update Profile Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while updating profile');
        }
    }
}
