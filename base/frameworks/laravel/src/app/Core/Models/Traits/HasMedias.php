<?php

namespace App\Core\Models\Traits;

use Spatie\MediaLibrary\InteractsWithMedia;

trait HasMedias
{
    use InteractsWithMedia;

    public function initializeHasMedias()
    {
        static::_hasMediasAddHiddens($this);
        static::_hasMediasAddMediaCollections($this);
        static::_hasMediasAppendAttributes($this);
    }

    /* -------------------- */

    private static function _hasMediasAddHiddens($model)
    {
        $model->hidden[] = 'media';
    }

    private static function _hasMediasAddMediaCollections($model)
    {
        if ($model->medias) {
            foreach ($model->medias as $key => $type) {
                match ($type) {
                    'single' => $model->addMediaCollection($key)->singleFile(),
                    'multi' => $model->addMediaCollection($key),
                };
            }
        }
    }

    private static function _hasMediasAppendAttributes($model)
    {
        if ($model->medias) {
            foreach ($model->medias as $key => $type) {
                match ($type) {
                    'single' => $model->appendAttributes[$key] = fn () => $model->getFirstMedia($key),
                    'multi' => $model->appendAttributes[$key] = fn () => $model->getMedia($key),
                };
            }
        }
    }
}
