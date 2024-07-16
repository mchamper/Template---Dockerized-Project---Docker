<?php

namespace App\Apis\Pipedrive;

class PipedriveUserApi extends PipedriveApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function getUser(int $id)
    {
        $res = $this->_try(function () use ($id) {
            return $this->_client->getUsers()->getOneUser($id)->jsonSerialize();
        });

        return $res['data'] ?? null;
    }

    public function getUserByEmail(string $email)
    {
        $res = $this->_try(function () use ($email) {
            return $this->_client->getUsers()->findUsersByName([
                'term' => $email,
                'searchByEmail' => 1,
            ])->jsonSerialize();
        });

        return $res['data'][0] ?? null;
    }

    public function isUserActive(int $id): bool
    {
        $res = $this->_try(function () use ($id) {
            return $this->_client->getUsers()->getOneUser($id)->jsonSerialize();
        });

        return !!($res['data']->activeFlag ?? null);
    }
}
