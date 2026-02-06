<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): Response  $next
     * @param  string ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = Auth::user();

        // ❗ Not authenticated → 401
        if (!$user) {
            throw new AuthenticationException();
        }

        // ❗ Check roles
        $hasRole = $user->roles()
            ->whereIn('name', $roles)
            ->exists();

        // ❗ Authenticated but forbidden → 403
        if (!$hasRole) {
            throw new AuthorizationException();
        }

        return $next($request);
    }
}

