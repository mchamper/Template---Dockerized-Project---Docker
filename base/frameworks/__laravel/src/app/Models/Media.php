<?php

namespace App\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    protected static function booted(): void
    {
        static::deleting(function (Media $media) {
            if ($media->collection_name === 'trash') {
                return true;
            }

            $media->collection_name = 'trash';
            $media->saveOrFail();

            return false;
        });
    }
}
