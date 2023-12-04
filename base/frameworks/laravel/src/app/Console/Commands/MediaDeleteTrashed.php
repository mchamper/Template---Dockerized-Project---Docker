<?php

namespace App\Console\Commands;

use App\Enums\QuizEventTypeEnum;
use App\Models\Media;
use App\Models\Quiz;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MediaDeleteTrashed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:media:delete-trashed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Se eliminan todos los archivos en la colección "trash"';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Media::whereCollectionName('trash')->get()->each(fn ($media) => $media->delete());
    }
}
