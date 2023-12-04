<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class MediaTmp extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    /**
     * Media collections.
     */
    public function registerMediaCollections(): void
    {
        $disk = config('media-library.disk_tmp_name');

        $this->addMediaCollection('tmp_system_user_picture')
            ->acceptsMimeTypes(['image/jpeg', 'image/png'])
            ->useDisk($disk);


        $this->addMediaCollection('tmp_system_user_photos')
            ->acceptsMimeTypes(['image/jpeg', 'image/png'])
            ->useDisk($disk);
    }
}
