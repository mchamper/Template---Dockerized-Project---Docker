<?php

namespace App\Core\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // foreach (['user', 'system-user', 'internal-user', 'external-user'] as $userType) {
        //     if (auth("api_{$userType}")->check()) {
        //         auth("api_{$userType}")->user()->verifyStatus();
        //     }
        // }

        if (auth()->check()) {
            if (method_exists(auth()->user(), 'verifyStatus')) auth()->user()->verifyStatus();
        }

        return $next($request);
    }
}
