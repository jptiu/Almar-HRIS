<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
        ]);

        $middleware->alias([
            'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        /**
         * Decide when to return JSON
         */
        $exceptions->shouldRenderJsonWhen(function ($request) {
            return $request->expectsJson()
                || $request->is('api/*')
                || $request->header('X-Requested-With') === 'XMLHttpRequest';
        });

        /**
         * Centralized exception handler
         */
        $exceptions->render(function (\Throwable $e, $request) {

            /**
             * Validation errors (422)
             */
            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $e->errors(),
                ], 422);
            }

            /**
             * Unauthenticated (401)
             */
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            /**
             * Forbidden / Unauthorized (403)
             *
             * IMPORTANT:
             * Laravel converts AuthorizationException into AccessDeniedHttpException
             */
            if (
                $e instanceof AuthorizationException ||
                $e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden',
                ], 403);
            }

            /**
             * Not found (404)
             */
            if ($e instanceof NotFoundHttpException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found',
                ], 404);
            }

            /**
             * Default server error (500)
             */
            Log::error($e);

            if (app()->isLocal()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'trace'   => $e->getTrace(),
                ], 500);
            }

            return response()->json([
                'success' => false,
                'message' => 'Internal server error',
                'errors'  => null,
            ], 500);
        });
    })->create();
