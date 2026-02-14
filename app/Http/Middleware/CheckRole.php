<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  string ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // ❗ Not authenticated → 401
        if (!$user) {
            throw new AuthenticationException();
        }

        // 🔑 Get active role from session (via model helper)
        $activeRole = $user->getActiveRole();

        // ❗ No active role selected
        if (!$activeRole) {
            throw new AuthorizationException('No active role selected.');
        }

        // 🔒 Ensure user actually owns this role (prevents session tampering)
        if (!$user->hasRole($activeRole)) {
            throw new AuthorizationException('Invalid active role.');
        }

        // ❗ Active role not allowed for this route
        if (!in_array($activeRole, $roles)) {
            throw new AuthorizationException();
        }

        return $next($request);
    }
}