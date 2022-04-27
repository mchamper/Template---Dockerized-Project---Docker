<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;

class AuthCheckChannel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, string $channel)
    {
        $channels = explode(',', $channel);

        if (Auth::check()) {
            if (!empty(Auth::payload()['chn']) && !in_array(Auth::payload()['chn'], $channels)) {
                throw new AuthorizationException('This token is not unauthorized for this channel.');
            }
        }

        foreach ($channels as $channel) {
            switch ($channel) {
                case 'blockone': {
                    if (request()->header('x-api-key') !== config('services.blockone.api_key')) {
                        throw new AuthorizationException('This request cannot access this endpoint.');
                    }

                    break;
                }
            }
        }

        return $next($request);
    }
}
