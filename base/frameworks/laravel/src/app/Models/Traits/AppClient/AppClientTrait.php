<?php

namespace App\Models\Traits\AppClient;


use App\Enums\AppClientStatusEnum;
use App\Enums\ErrorEnum;
use Illuminate\Support\Str;

trait AppClientTrait
{
    public function verifyStatus()
    {
        if (!$this->status->is(AppClientStatusEnum::Active)) {
            ErrorEnum::INACTIVE_APP_CLIENT_ERROR->throw();
        }
    }

    public function verifyHost()
    {
        if (!app()->environment('local')) {
            if ($this->hosts !== '*') {
                $origin = request()->header('origin') ?: request()->header('referer');
                $origin = Str::replaceEnd('/', '', Str::finish($origin, '/'));
                $can = false;

                foreach ($this->hosts as $host) {
                    if (preg_match('/' . $host . '/', $origin)) {
                        $can = true;
                        break;
                    }
                }

                if (!$can) {
                    ErrorEnum::ORIGIN_NOT_ALLOWED_ERROR->throw();
                }
            }
        }
    }

    public function verifyScope()
    {
        if ($this->scopes !== '*') {
            $scopes = array_merge($this->scopes, ['auth']);
            $path = Str::finish(request()->path(), '/');
            $can = false;

            foreach ($scopes as $scope) {
                $scope = Str::finish($scope, '/');

                if (Str::startsWith($path, $scope)) {
                    $can = true;
                    break;
                }
            }

            if (!$can) {
                ErrorEnum::PATH_NOT_ALLOWED_ERROR->throw();
            }
        }
    }
}
