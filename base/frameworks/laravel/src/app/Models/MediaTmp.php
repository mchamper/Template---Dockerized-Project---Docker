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

        /* -------------------- */

        $this->addMediaCollection('tmp_multimedia_config_logo')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_multimedia_config_bg_video')
            ->acceptsMimeTypes(['video/mp4', 'video/webm'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_multimedia_config_bg_image')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_multimedia_config_monitor_bg_video')
            ->acceptsMimeTypes(['video/mp4', 'video/webm'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_multimedia_config_monitor_bg_image')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->useDisk(self::$_diskToUse);


        $this->addMediaCollection('tmp_multimedia_config_banner')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg'])
            ->useDisk(self::$_diskToUse);

        /* -------------------- */

        $this->addMediaCollection('tmp_style_config_css_file')
            ->acceptsMimeTypes(['text/css'])
            ->useDisk(self::$_diskToUse);

        /* -------------------- */

        $this->addMediaCollection('tmp_question_image')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg'])
            ->useDisk(self::$_diskToUse);

        $this->addMediaCollection('tmp_question_audio')
            ->acceptsMimeTypes(['audio/mpeg'])
            ->useDisk(self::$_diskToUse);
    }
}
