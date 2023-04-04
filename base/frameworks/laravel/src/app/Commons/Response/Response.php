<?php

namespace App\Commons\Response;

use Illuminate\Support\Str;

class Response
{
    public static function json(?array $data = null, $message = 'Ok.', $status = 200, array $headers = [], $options = 0)
    {
        return response()->json([
            'time' => round(microtime(true) - LARAVEL_START, 4),
            'status' => $status,
            'message' => $message,
            'body' => $data,
        ], $status, $headers, $options);
    }

    public static function jsonHello()
    {
        $paths = explode('/', request()->path());

        $main = Str::upper($paths[0]);
        $version = ($paths[1] ?? null);
        $channel = ($paths[2] ?? null) ? '(' . Str::title($paths[2]) . ')' : '';

        return self::json(null, trim('Hello there, from ' . $main . ' ' . $version . ' ' . $channel));
    }
}
