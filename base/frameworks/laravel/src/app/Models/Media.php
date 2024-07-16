<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    protected static function booted(): void
    {
        static::deleting(function (Media $media) {
            if ($media->collection_name === 'trash') {
                return !app()->environment('local') || !Str::startsWith($media->disk, 's3');
            }

            $media->collection_name = 'trash';
            $media->saveOrFail();

            return false;
        });

        static::deleted(function (Media $media) {
            // FIX: La librería de Spatie, por alguna razón cuando el disk es s3, no elimina automáticamente
            // los archivos existentes en los buckets.
            if (Str::startsWith($media->disk, 's3')) {
                Storage::disk($media->disk)->delete($media->getPath());
            }
        });
    }
}
