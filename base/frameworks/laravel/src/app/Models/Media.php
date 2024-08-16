<?php

namespace App\Models;

use App\Core\Services\AuthService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    protected $appends = [
        'original_url',
        'preview_url',
        'private_url',
    ];

    protected $hidden = [
        'model'
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('withoutTrashed', function (Builder $builder) {
            $builder->where('collection_name', '!=', 'trash');
        });

        /* -------------------- */

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

    /**
     * Accessors & Mutators.
     */
    protected function privateUrl(): Attribute
    {
        $currentToken = request()->bearerToken();

        return Attribute::make(
            get: fn () => Str::endsWith($this->disk, '_private')
                ? url("/private-storage/media/{$this->id}?token={$currentToken}")
                : null,
        );
    }

    /**
     * Scopes.
     */
    public function scopeWithTrashed($query)
    {
        return $query->withoutGlobalScope('withoutTrash');
    }

    public function scopeOnlyTrashed($query)
    {
        return $query->withoutGlobalScope('withoutTrash')->where('collection_name', 'trash');
    }

    /**
     * Customs.
     */
    public function isAuthUserTheOwner()
    {
        if (!$auth = AuthService::getCurrentGuard()) {
            return false;
        }

        if (
            get_class($auth->user()) === ($this->custom_properties['owner']['user_model'] ?? null)
            && $auth->id() === ($this->custom_properties['owner']['user_id'] ?? null)
        ) {
            return true;
        }

        return false;
    }
}
