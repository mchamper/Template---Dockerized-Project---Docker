<?php

namespace App\Commons\Response;

class Response
{
    public static function json($data = [], $message = 'Ok.', $status = 200, array $headers = [], $options = 0)
    {
        return response()->json([
            'time' => round(microtime(true) - LARAVEL_START, 4),
            'status' => $status,
            'message' => $message,
            'body' => $data,
        ], $status, $headers, $options);
    }
}
