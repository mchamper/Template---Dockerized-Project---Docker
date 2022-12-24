<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/', function () { return Response::json(null, 'Hello Api Backoffice (v1)!'); });
    /* -------------------- */
    Route::post('/auth/system-user/login', 'AuthSystemUserController@login');
    /* -------------------- */
    Route::get('/combos', 'CombosController@get');
});

Route::middleware(['auth:api:system-user'])->group(function () {
    Route::get('/auth/system-user/me', 'AuthSystemUserController@me');
    /* -------------------- */
    Route::get('/users', 'UserController@getList');
    Route::post('/users/{userId}/assets', 'UserAssetController@create');
    /* -------------------- */
    Route::patch('/user/{userId}/market-tokens/approve', 'UserMarketTokenController@approveForUser');
    Route::patch('/user/{userId}/market-tokens/reject', 'UserMarketTokenController@rejectForUser');
    /* -------------------- */
    Route::get('/user-market-tokens', 'UserMarketTokenController@getList');
    Route::get('/user-market-tokens/{userMarketTokenId}', 'UserMarketTokenController@getDetail');
    Route::patch('/user-market-tokens/{userMarketTokenId}/approve', 'UserMarketTokenController@approve');
    Route::patch('/user-market-tokens/{userMarketTokenId}/reject', 'UserMarketTokenController@reject');
    /* -------------------- */
    Route::get('/metrics/daily-records', 'MetricController@getDailyRecordList');
    Route::get('/metrics/dau', 'MetricController@getDauList');
    Route::get('/metrics/retentions', 'MetricController@getRetentionList');
    /* -------------------- */
    Route::get('ranking-configs/tournaments', 'RankingCustomCategoryConfigController@getList');
    Route::get('ranking-configs/tournaments/{rankingCustomCategoryConfigId}', 'RankingCustomCategoryConfigController@getOne');
    Route::post('ranking-configs/tournaments', 'RankingCustomCategoryConfigController@create');
    Route::put('ranking-configs/tournaments/{rankingCustomCategoryConfigId}', 'RankingCustomCategoryConfigController@update');
    Route::delete('ranking-configs/tournaments/{rankingCustomCategoryConfigId}', 'RankingCustomCategoryConfigController@delete');

    Route::get('ranking-configs/weeklies', 'RankingCustomWeeklyConfigController@getList');
    Route::get('ranking-configs/weeklies/{rankingCustomConfigId}', 'RankingCustomWeeklyConfigController@getOne');
    Route::post('ranking-configs/weeklies', 'RankingCustomWeeklyConfigController@create');
    Route::put('ranking-configs/weeklies/{rankingCustomConfigId}', 'RankingCustomWeeklyConfigController@update');
    Route::delete('ranking-configs/weeklies/{rankingCustomConfigId}', 'RankingCustomWeeklyConfigController@delete');

    Route::get('ranking-configs/monthlies', 'RankingCustomMonthlyConfigController@getList');
    Route::get('ranking-configs/monthlies/{rankingCustomConfigId}', 'RankingCustomMonthlyConfigController@getOne');
    Route::post('ranking-configs/monthlies', 'RankingCustomMonthlyConfigController@create');
    Route::put('ranking-configs/monthlies/{rankingCustomConfigId}', 'RankingCustomMonthlyConfigController@update');
    Route::delete('ranking-configs/monthlies/{rankingCustomConfigId}', 'RankingCustomMonthlyConfigController@delete');
});
