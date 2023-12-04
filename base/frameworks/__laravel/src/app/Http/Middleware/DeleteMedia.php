<?php

namespace App\Http\Middleware;

use App\Models\Media;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DeleteMedia
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        Media::whereCollectionName('trash')->get()->each(fn ($media) => $media->delete());

        return $response;
    }
}
