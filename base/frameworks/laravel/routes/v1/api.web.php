<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/', function () { return Response::json(null, 'Hello Api Web (v1)!'); });
    /* -------------------- */
});

Route::middleware(['auth:api:user'])->group(function () {
    //
});
