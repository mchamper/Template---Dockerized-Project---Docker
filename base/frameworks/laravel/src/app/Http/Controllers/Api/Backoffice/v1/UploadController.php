<?php

namespace App\Http\Controllers\Api\Backoffice\v1;

use App\Core\Response\Response;
use App\Core\Services\AuthService;
use App\Enums\Response\ErrorEnum;
use App\Http\Controllers\Controller;
use App\Models\MediaTmp;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    public function upload()
    {
        $concept = 'tmp:' . request()->query('concept');
        $mediaTmp = MediaTmp::firstOrCreate();

        if (!$mediaTmp->getMediaCollection($concept)) {
            ErrorEnum::InvalidRequestConcept->throw();
        }

        $rules = array_merge(
            ['bail', 'required', 'file'],
            $mediaTmp->concepts[$concept]['rules'] ?? ['max:2048']
        );

        Validator::make(
            request()->allFiles(),
            ['file' => $rules],
        )->validate();

        $auth = AuthService::getCurrentGuard();

        $file = $mediaTmp->addMediaFromRequest('file')
            ->withCustomProperties($auth ? [
                'owner' => [
                    'user_model' => get_class($auth->user()),
                    'user_id' => $auth->id(),
                ]
            ] : [])
            ->toMediaCollection($concept);

        return Response::json([
            'file' => $file,
        ]);
    }
}
