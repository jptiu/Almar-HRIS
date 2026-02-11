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

            $user->load(['roles', 'employee.position', 'employee.department', 'employee.branch', 'employee.company', 'employee.status']);

            // Return flattened resource (limited data for login response)
            return $this->success(new UserLoginResource($user), 'Login successful');

        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Login Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);
            
            return $this->serverError('An error occurred during login');
        }
    }

    /**
     * Logout user (invalidate session)
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return $this->success(null, 'Logged out successfully');
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['roles', 'employee.position', 'employee.department', 'employee.branch', 'employee.company', 'employee.status']);
        return $this->success(new UserResource($user), 'User retrieved successfully');
    }

    /**
     * Update current user's profile
     */
    public function updateProfile(UpdateMyProfileRequest $request)
    {
        try {
            $user = $request->user();
            $validated = $request->validated();

            // Update user fields (email, password)
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }
            if (isset($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            $user->save();

            // Update employee personal info
            if ($user->employee) {
                $employeeFields = [
                    'first_name',
                    'middle_name',
                    'last_name',
                    'phone',
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

            // Reload relationships and return updated profile
            $user->load(['roles', 'employee.position', 'employee.department', 'employee.branch', 'employee.company', 'employee.status']);

            return $this->success(new UserResource($user), 'Profile updated successfully');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Update Profile Error: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);

            return $this->serverError('An error occurred while updating profile');
        }
    }
}

