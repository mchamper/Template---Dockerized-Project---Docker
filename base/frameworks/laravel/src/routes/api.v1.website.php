<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/', function () { return Response::json(null, 'Hello API v1 --- Website!'); });
    /* -------------------- */
});

Route::middleware(['auth:api_user'])->group(function () {
    //
});
