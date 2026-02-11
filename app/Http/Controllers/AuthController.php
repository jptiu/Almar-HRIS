<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            // Find user
            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return $this->unauthorized('Invalid credentials');
            }

            // Login user via session
            Auth::login($user);

            // Regenerate session to prevent session fixation
            $request->session()->regenerate();

            // Load roles and employee data with relationships for the user
            $user->load(['roles', 'employee.position', 'employee.department', 'employee.branch', 'employee.company']);

            return $this->success([
                'user' => $user,
            ], 'Login successful');
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
        $user = $request->user()->load(['roles', 'employee.position', 'employee.department', 'employee.branch', 'employee.company']);
        return $this->success(['user' => $user], 'User retrieved successfully');
    }
}

