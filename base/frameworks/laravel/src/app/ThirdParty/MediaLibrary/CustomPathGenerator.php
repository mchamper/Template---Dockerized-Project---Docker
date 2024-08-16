<?php

namespace App\ThirdParty\MediaLibrary;

use App\Models\MediaTmp;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\DefaultPathGenerator;

class CustomPathGenerator extends DefaultPathGenerator
{
    public function getPath(Media $media): string
    {
        if ($media->model instanceof MediaTmp) {
            return '/_tmp/'.$this->getBasePath($media).'/';
        }

        return $this->getBasePath($media).'/';
    }
}
