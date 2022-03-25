<?php

namespace App\Repositories;

use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

abstract class BaseRepository
{
    // abstract public static function getOne(array $params = []): Model;

    // abstract public static function getAll(array $params = []): Collection;

    // abstract public static function getList(array $params = []): LengthAwarePaginator;

    /* -------------------- */

    // abstract public static function getOneCmd(Command $cmd): Model;

    // abstract public static function getAllCmd(Command $cmd): Collection;

    // abstract public static function getListCmd(Command $cmd): LengthAwarePaginator;

    /* -------------------- */

    // abstract public static function save(array $input, ?Model $model = null);

    /* -------------------- */

    /** Sync HasMany relation template:
    public function syncRelatedModels(array $inputs, Model $model, bool $mustDetach = true): void
    {
        if ($mustDetach) {
            $ids = $model->related_models->pluck('id')->toArray();
            $idsForDelete = array_diff($ids, collect($inputs)->pluck('id')->toArray());

            foreach ($idsForDelete as $id) RelatedModel::find($id)->delete();
        }

        foreach ($inputs as $input) $this->saveRelatedModel($input, $model);
    }
     */

    /** Save HasOne relation template:
    public function saveRelatedModel(array $input, Model $model): void
    {
        $input['model'] = ['id' => $model->id];
        RelatedModelRepository::save($input, $model->related_models()->where('id', $input['id'] ?? null)->first());
    }
     */

    /* -------------------- */

    protected static function _fill(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key => $repo) {
            if (is_numeric($key)) {
                $key = $repo;
                $repo = null;
            }

            if (!array_key_exists($key, $input)) {
                continue;
            }

            if ($id = $input[$key]['id'] ?? $input[$key]->id ?? null) {
                $model->$key()->associate($id);
                continue;
            }

            if ($repo) {
                $model->$key()->associate($repo::save($input[$key])->id);
                continue;
            }

            $model->$key = $input[$key];
        }
    }
}
