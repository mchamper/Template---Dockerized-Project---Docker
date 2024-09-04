<?php

use App\Models\Media;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api_user,api_system-user', 'verified'])->group(function () {
    Route::get('/private-storage/media/{mediaId}', function (string $mediaId) {
        $media = Media::findOrFail($mediaId);

        if (
            !$media->isAuthUserTheOwner()
            && !auth('api_system-user')->check()
        ) {
            return abort(404, 'File not found.');
        }

        return response()->download($media->getPath(), null, [], null);
    });
});
