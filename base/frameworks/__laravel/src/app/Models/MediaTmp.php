<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class MediaTmp extends Model implements HasMedia
{
    use HasFactory,
        InteractsWithMedia;

    private static $_diskToUse = 'media_tmp';

    /**
     * Media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('tmp_system_user_picture')
            ->acceptsMimeTypes(['image/jpeg', 'image/png'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_system_user_photos')
            ->acceptsMimeTypes(['image/jpeg', 'image/png'])
            ->useDisk(self::$_diskToUse);
    }
}