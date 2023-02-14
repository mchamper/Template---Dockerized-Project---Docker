<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/', function () { return Response::json(null, 'Hello Api Mobile (v1)!'); });
    /* -------------------- */
    Route::post('/auth/user/login', 'AuthUserController@login');
    Route::get('/auth/user/verification-email/confirm/{hash}', 'AuthUserVerificationEmailController@confirm');
    Route::post('/auth/user/verification-email/request', 'AuthUserVerificationEmailController@request')->middleware(['throttle:send-email']);
    /* -------------------- */
    Route::post('/auth/user/reset-password/request', 'AuthUserResetPasswordController@request');
});

Route::middleware(['auth:api:user'])->group(function () {
    Route::get('/auth/user/me', 'AuthUserController@me');
    Route::delete('/auth/user/delete', 'AuthUserController@delete');
    /* -------------------- */
    Route::post('/auth/user/assets', 'AuthUserAssetController@create');
    Route::post('/auth/user/assets/exchange-stardust-for-moons/{userMarketTokenId}', 'AuthUserAssetController@exchangeStardustForMoons');
    Route::patch('/auth/user/assets/by-type/{userAssetTypeId}/use', 'AuthUserAssetController@useByType');
    /* -------------------- */
    Route::post('/auth/user/wallet/sync', 'AuthUserWalletController@sync');
    Route::delete('/auth/user/wallet/unset', 'AuthUserWalletController@unset');
    /* -------------------- */
    Route::post('/auth/user/invite-friends/receive/{code}','AuthUserInviteFriendController@receive');
    /* -------------------- */
    Route::post('/auth/user/game-result-points/{categoryId}/add', 'AuthUserGameResultPointsController@add');
    /* -------------------- */
    Route::post('/auth/user/game/start', 'AuthUserGameController@start');
    /* -------------------- */
    Route::post('/questions/{questionId}/report', 'QuestionController@report');
    /* -------------------- */
    if (app()->environment('local')) Route::get('/auth/user/wallet/balance', 'AuthUserWalletController@getBalance');
    if (app()->environment('local')) Route::post('/auth/user/asset-combos/unuse', 'AuthUserAssetComboController@unuse');
    /* -------------------- */
    Route::get('ranking/tournament/{categoryId}', 'RankingCustomCategoryController@getOne');
});
