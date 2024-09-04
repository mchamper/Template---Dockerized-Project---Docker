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

    public $concepts = [];

    /**
     * Media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->_registerTmpCollections(new User());
        $this->_registerTmpCollections(new SystemUser());
        $this->_registerTmpCollections(new ExternalUser());
    }

    private function _registerTmpCollections(HasMedia $model)
    {
        if ($model->getMediasConfig()) {
            foreach ($model->getMediasConfig() as $options) {
                $this->concepts[$options['tmp_concept']] = $options;

                $this->addMediaCollection($options['tmp_concept'])
                    ->useDisk($options['disk']);
            }
        }
    }
}
