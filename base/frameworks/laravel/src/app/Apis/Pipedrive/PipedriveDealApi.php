<?php

namespace App\Apis\Pipedrive;

use Illuminate\Support\Facades\Log;

class PipedriveDealApi extends PipedriveApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function getCustomFieldData(string $key)
    {
        $res = $this->_try(function () {
            return $this->_client->getDealFields()->getAllDealFields([])->jsonSerialize();
        });

        $data = collect($res->data)->filter(function ($item) use ($key) {
            return $item->key === $key;
        })->first();

        return $data;
    }

    /* -------------------- */

    public function getDeals(int $page = 1, int $limit = 20): mixed
    {
        $res = $this->_try(function () use ($page, $limit) {
            return $this->_client->getDeals()->getAllDeals([
                'start' => $limit * ($page - 1),
                'limit' => $limit,
            ])->jsonSerialize();
        }, retryDelay: 0.5);

        return [
            'data' => $res->data,
            'pagination' => $res->additional_data->pagination,
        ];
    }

    public function getDeal(int $dealId): mixed
    {
        $res = $this->_try(function () use ($dealId) {
            return $this->_client->getDeals()->getDetailsOfADeal($dealId)->jsonSerialize();
        });

        return $res->data;
    }

    /* -------------------- */

    public function addFollower(int $dealId, int $followerId)
    {
        $res = $this->_try(function () use ($dealId, $followerId) {
            return $this->_client->getDeals()->addAFollowerToADeal([
                'id' => $dealId,
                'userId' => $followerId,
            ])->jsonSerialize();
        }, retryDelay: 0.3);

        if ($res['success'] !== true) {
            $this->_throw('No se ha podido agregar como seguidor al usuario #' . $followerId . ' en el deal #' . $dealId);
        }
    }

    public function addNote(int $dealId, string $content)
    {
        $res = $this->_tryOne(function () use ($dealId, $content) {
            return $this->_client->getNotes()->addANote([
                'dealId' => $dealId,
                'content' => $content,
            ])->jsonSerialize();
        });

        if ($res['success'] !== true) {
            $this->_throw('No se ha podido agregar la nota en el deal #' . $dealId);
        }
    }
}
