<?php

use App\Core\Response\Response;
use App\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () { return Response::jsonHello(); });

Route::middleware(['auth:system_user'])->group(function () {
    Route::get('/system-user/telescope/transfer-session', function () {
        Request::session()->invalidate();

        Auth::guard('telescope')->loginUsingId(Auth::systemUser()->id);

        Request::session()->put('expires_at', Carbon::now()->addMinutes(10));
        Request::session()->regenerate();

        return redirect('/telescope');
    });
});
