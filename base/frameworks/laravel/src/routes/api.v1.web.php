<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:app_client'])->group(function () {
    Route::get('/', function () { return Response::jsonHello(); });
});

Route::middleware(['auth:user'])->group(function () {
    //
});
