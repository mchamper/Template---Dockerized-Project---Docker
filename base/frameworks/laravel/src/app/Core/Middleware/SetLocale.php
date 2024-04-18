<?php

namespace App\Core\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $acceptLanguage = Str::substr(Str::lower($request->headers->get('Accept-Language')), 0, 2);

        Lang::setLocale($acceptLanguage ?: config('app.locale'));
        return $next($request);
    }
}
