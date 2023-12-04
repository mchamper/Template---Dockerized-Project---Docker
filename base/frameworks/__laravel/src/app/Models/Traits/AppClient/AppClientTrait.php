<?php

namespace App\Models\Traits\AppClient;

use App\Commons\Response\ErrorEnum;
use App\Enums\AppClientStatusEnum;
use Illuminate\Support\Str;

trait AppClientTrait
{
    public function checkStatus()
    {
        if (!$this->status->is(AppClientStatusEnum::Active)) {
            ErrorEnum::INACTIVE_APP_CLIENT_ERROR->throw();
        }
    }

    public function checkHost()
    {
        if (!app()->environment('local')) {
            if ($this->hosts !== '*') {
                $origin = request()->header('origin');
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

    public function checkScope()
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
