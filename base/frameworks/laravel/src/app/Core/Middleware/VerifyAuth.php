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
        foreach (config('auth.guards') as $guard => $guardConfig) {
            if (auth($guard)->check()) {
                auth($guard)->user()->verifyStatus();
            }
        }

        return $next($request);
    }
}
