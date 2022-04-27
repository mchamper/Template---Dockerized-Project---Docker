<?php

namespace App\Repositories;

use App\Models\UserAsset;

class UserAssetRepository extends BaseRepository
{
    public static function save(array $input, ?UserAsset $userAsset = null): UserAsset
    {
        $isNew = false;

        if (!$userAsset) {
            $userAsset = new UserAsset();
            $userAsset->value = 1;
            $userAsset->mint_status()->associate(2);
            $userAsset->origin()->associate(2);

            $isNew = true;
        }

        static::_fill([
            'market_transaction_ref',
            'market_token',
            'is_used',
            'comments',
            /* -------------------- */
            'user',
            'type',
            'combo',
            'mint_status',
            'origin',
        ], $input, $userAsset);

        $userAsset->saveOrFail();

        return $userAsset;
    }
}
