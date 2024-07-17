<?php

namespace App\Core\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SessionExpiresAt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($expiresAt = request()->session()->get('expires_at')) {
            if (now() > $expiresAt) {
                request()->session()->invalidate();
                throw new AuthenticationException();
            }
        }

        return $next($request);
    }
}
