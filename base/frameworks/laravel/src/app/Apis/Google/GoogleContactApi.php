<?php

namespace App\Apis\Google;

use Google\Service\PeopleService;
use Google\Service\PeopleService\Person;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class GoogleContactApi extends GoogleApi
{
    private $_personFields = 'names,nicknames,emailAddresses,phoneNumbers';

    public function __construct(?string $subject = null)
    {
        parent::__construct($subject);

        $this->_client->addScope([
            PeopleService::CONTACTS,
        ]);

        $this->_service = new PeopleService($this->_client);
    }

    /* -------------------- */

    private function _parseContact(Person $item, bool $returnRaw = false)
    {
        $pipedriveId = collect($item->nicknames)->filter(function ($item) {
            return Str::startsWith($item->value, 'pipedriveId-');
        })->first()->value ?? null;

        if ($pipedriveId) {
            $pipedriveId = explode('-', $pipedriveId)[1] ?? null;
        }

        return [
            'resourceName' => $item->resourceName,
            'name' => collect($item->names)->firstWhere('metadata.primary', true)->displayName ?? null,
            'email' => collect($item->emailAddresses)->firstWhere('metadata.primary', true)->value ?? null,
            'phone' => collect($item->phoneNumbers)->firstWhere('metadata.primary', true)->value ?? null,
            'pipedriveId' => $pipedriveId ? (int) $pipedriveId : null,
            '_raw' => $returnRaw ? $item : null,
        ];
    }

    /* -------------------- */

    public function getContactList($pageToken = null, bool $returnRaw = false, $pageSize = 500)
    {
        $res = $this->_try(function () use ($pageToken, $pageSize) {
            return $this->_service->people_connections->listPeopleConnections('people/me', [
                'pageToken' => $pageToken,
                'pageSize' => $pageSize,
                'personFields' => $this->_personFields,
                'sortOrder' => 'FIRST_NAME_ASCENDING',
            ]);
        });

        $data = collect($res['connections'])->map(function ($item) use ($returnRaw) {
            return $this->_parseContact($item, $returnRaw);
        })->toArray();

        return [
            'data' => $data,
            'pagination' => [
                'nextPageToken' => $res['nextPageToken'],
                'nextSyncToken' => $res['nextSyncToken'],
                'totalItems' => $res['totalItems'],
                'totalPeople' => $res['totalPeople'],
            ],
        ];
    }

    public function getContacts(bool $returnRaw = false)
    {
        $contacts = [];
        $pageToken = null;

        do {
            $res = $this->getContactList($pageToken, $returnRaw);

            $contacts = Arr::collapse([$contacts, $res['data']]);
            $pageToken = $res['pagination']['nextPageToken'];

            sleep(1);
        } while ($pageToken);

        return $contacts;
    }

    public function searchContacts(?string $query, bool $returnFirst = false, bool $returnRaw = false, $maxResults = 5)
    {
        $res = $this->_try(function () use ($query, $maxResults) {
            // Warmup cache
            $this->_service->people->searchContacts([
                'query' => 'WARMUP_CACHE',
                'readMask' => $this->_personFields,
                'pageSize' => 1,
            ]);

            // Send search request after several seconds
            sleep(1);

            return $this->_service->people->searchContacts([
                'query' => $query,
                'readMask' => $this->_personFields,
                'pageSize' => $maxResults,
            ]);
        });

        $data = collect($res['results'])->map(function ($item) use ($returnRaw) {
            return $this->_parseContact($item['person'], $returnRaw);
        })->toArray();

        if ($returnFirst) {
            return $data[0] ?? null;
        }

        return $data;
    }

    /* -------------------- */

    public function createContact(Person $input)
    {
        $res = $this->_try(function () use ($input) {
            return $this->_service->people->createContact($input, [
                'personFields' => $this->_personFields,
            ]);
        });

        return $res;
    }

    public function updateContact(string $resourceName, Person $input)
    {
        $res = $this->_try(function () use ($resourceName, $input) {
            return $this->_service->people->updateContact($resourceName, $input, [
                'updatePersonFields' => $this->_personFields,
            ]);
        });

        return $res;
    }
}
