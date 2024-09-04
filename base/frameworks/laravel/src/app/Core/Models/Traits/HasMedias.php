<?php

namespace App\Core\Models\Traits;

use Illuminate\Support\Str;
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

    private static function _getPublicDisk()
    {
        return config('media-library.disk_name');
    }

    private static function _getPrivateDisk()
    {
        return config('media-library.disk_name') . '_private';
    }

    private static function _getDisk(string $visibility)
    {
        return match ($visibility) {
            'public' => self::_getPublicDisk(),
            'private' => self::_getPrivateDisk(),
        };
    }

    /* -------------------- */

    private static function _hasMediasAddHiddens($model)
    {
        $model->hidden[] = 'media';
    }

    private static function _hasMediasAddMediaCollections($model)
    {
        if ($model->medias) {
            foreach ($model->medias as $key => $options) {
                match ($options['type']) {
                    'single' => $model->addMediaCollection($key)->singleFile()->useDisk(self::_getDisk($options['visibility'])),
                    'multiple' => $model->addMediaCollection($key)->useDisk(self::_getDisk($options['visibility'])),
                };
            }
        }
    }

    private static function _hasMediasAppendAttributes($model)
    {
        if ($model->medias) {
            foreach ($model->medias as $key => $options) {
                match ($options['type']) {
                    'single' => $model->appendAttributes[$key] = fn () => $model->getFirstMedia($key),
                    'multiple' => $model->appendAttributes[$key] = fn () => $model->getMedia($key)->all(),
                };
            }
        }
    }

    /* -------------------- */

    public function getMediasConfig()
    {
        $className = Str::snake(class_basename($this));
        $medias = [];

        foreach ($this->medias as $key => $options) {
            $medias[$key] = $options;
            $medias[$key]['tmp_concept'] = "tmp:{$className}:{$key}";
            $medias[$key]['disk'] = self::_getDisk($options['visibility']);
        }

        return $medias;
    }
}
