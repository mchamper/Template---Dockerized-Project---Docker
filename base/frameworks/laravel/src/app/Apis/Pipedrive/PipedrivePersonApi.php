<?php

namespace App\Apis\Pipedrive;

use Illuminate\Support\Arr;

class PipedrivePersonApi extends PipedriveApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    private function _parsePerson($item, bool $returnRaw = false)
    {
        return [
            'pipedriveId' => $item->id,
            'name' => $item->name,
            'email' => collect($item->email)->firstWhere('primary', true)->value ?? null,
            'phone' => collect($item->phone)->firstWhere('primary', true)->value ?? null,
            '_raw' => $returnRaw ? $item : null,
        ];
    }

    /* -------------------- */

    public function getPersonList($page = 1, bool $returnRaw = false, $pageSize = 1000)
    {
        $res = $this->_try(function () use ($page, $pageSize) {
            return $this->_client->getPersons()->getAllPersons([
                'start' => $pageSize * ($page - 1),
                'limit' => $pageSize,
                'sort' => 'name ASC',
            ])->jsonSerialize();
        });

        $data = collect($res->data)->map(function ($item) use ($returnRaw) {
            return $this->_parsePerson($item, $returnRaw);
        })->toArray();

        return [
            'data' => $data,
            'pagination' => [
                'page' => $page,
                'pageSize' => $pageSize,
                'hasMoreItems' => $res->additional_data->pagination->more_items_in_collection,
            ],
        ];
    }

    public function getPerson(int $personId)
    {
        $res = $this->_try(function () use ($personId) {
            return $this->_client->getPersons()->getDetailsOfAPerson($personId)->jsonSerialize();
        });

        return $res->data;
    }

    public function getPersons()
    {
        $persons = [];
        $page = 1;

        do {
            $res = $this->getPersonList($page);

            $persons = Arr::collapse([$persons, $res['data']]);
            $page++;

            sleep(1);
        } while ($res['pagination']['hasMoreItems']);

        return $persons;
    }
}
