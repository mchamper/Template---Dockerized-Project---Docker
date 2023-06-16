<?php

namespace App\Repositories;

use App\Models\Media;
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

    protected static function _fill(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key) {
            if (!array_key_exists($key, $input)) {
                continue;
            }

            $model->$key = $input[$key];
        }
    }

    protected static function _fillBelongs(array|string $keys, array $input, Model $model): void
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

            if ($repo) {
                $input[$key] = $repo::save($input[$key], $model->$key()->first());
            }

            if (empty($input[$key])) {
                $model->$key()->dissociate();
                continue;
            }

            if ($id = $input[$key]['id'] ?? $input[$key]->id) {
                $model->$key()->associate($id);
                continue;
            }
        }
    }

    protected static function _fillOnes(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key => $config) {
            if (!array_key_exists($key, $input)) {
                continue;
            }

            $repo = $config[0];
            $repoModel = $config[1];
            $relation = $config[2];
            $relatedModel = $model->$key()->first();

            if (empty($input[$key])) {
                if ($relatedModel) {
                    $input[$key][$relation] = null;
                    $repo::save($input[$key], $relatedModel);
                }

                continue;
            }

            $input[$key][$relation] = ['id' => $model->id];
            $repo::save($input[$key], $repoModel::find($input[$key]['id'] ?? null));
        }
    }

    protected static function _fillManies(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key => $config) {
            if (!array_key_exists($key, $input)) {
                continue;
            }

            $repo = $config[0];
            $repoModel = $config[1];
            $repoModelRelation = $config[2];
            $relatedModels = $model->$key()->get();

            $ids = $relatedModels->pluck('id')->toArray();
            $idsForDetach = array_diff($ids, collect($input[$key])->pluck('id')->toArray());
            foreach ($idsForDetach as $id) $repo::save([$repoModelRelation => null], $repoModel::findOrFail($id));

            foreach ($input[$key] as $value) {
                $value[$repoModelRelation] = ['id' => $model->id];
                $repo::save($value, $repoModel::find($value['id'] ?? null));
            }
        }
    }

    protected static function _fillManyBelongs(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key => $config) {
            if (!array_key_exists($key, $input)) {
                continue;
            }

            $repo = $config[0];
            $repoModel = $config[1];
            $idsForAttach = [];

            foreach ($input[$key] as $value) {
                $idsForAttach[$repo::save($value, $repoModel::find($value['id'] ?? null))->id] = $value['pivot'] ?? [];
            }

            $model->$key()->sync($idsForAttach);
        }
    }

    protected static function _fillMedia(array|string $keys, array $input, Model $model): void
    {
        $keys = (array) $keys;

        foreach ($keys as $key => $isMulti) {
            if (is_numeric($key)) {
                $key = $isMulti;
                $isMulti = false;
            }

            if (!array_key_exists($key, $input)) {
                continue;
            }

            $collectionName = $key;

            if ($isMulti) {
                $ids = $model->getMedia($collectionName)->pluck('id')->toArray();
                $idsForDelete = array_diff($ids, collect($input[$key])->pluck('id')->toArray());
                foreach ($idsForDelete as $id) Media::find($id)->delete();

                foreach ($input[$key] as $value) {
                    if (is_string($value)) {
                        $value = $model->addMediaFromUrl($value)->toMediaCollection($collectionName);
                        continue;
                    }

                    $media = Media::findOrFail($value['id']);

                    if ($media->model_type === 'App\Models\MediaTmp') {
                        $media->move($model, $collectionName);
                    }
                    else if ($media->model_type === $model::class && $media->model_id !== $model->id) {
                        $media->copy($model, $collectionName);
                    }
                }
            } else {
                if (empty($input[$key])) {
                    $model->clearMediaCollection($collectionName);
                    continue;
                }

                if (is_string($input[$key])) {
                    $input[$key] = $model->addMediaFromUrl($input[$key])->toMediaCollection($collectionName);
                    continue;
                }

                $media = Media::findOrFail($input[$key]['id']);

                if ($media->model_type === 'App\Models\MediaTmp') {
                    $media->move($model, $collectionName);
                }
                else if ($media->model_type === $model::class && $media->model_id !== $model->id) {
                    $media->copy($model, $collectionName);
                }
            }
        }
    }
}
