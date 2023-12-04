<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Models\MediaTmp;

class UploadController extends Controller
{
    public function upload()
    {
        $concept = request()->query('concept');
        $mediaTmp = MediaTmp::firstOrCreate();

        $file = $mediaTmp->addMediaFromRequest('file')
            ->toMediaCollection('tmp_' . $concept);

        return Response::json([
            'file' => $file,
        ]);
    }
}
