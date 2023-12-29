<?php

use Illuminate\Support\Facades\Route;

Route::any('/{any}', function () {
    return view('angular');
})->where('any', '^(?!(api|auth)).*$');
