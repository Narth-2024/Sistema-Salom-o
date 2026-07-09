<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class SupabaseStorageService
{
    private string $bucket;
    private string $baseUrl;
    private string $serviceKey;

    public function __construct()
    {
        $this->bucket = 'avatars';
        $this->baseUrl = rtrim(config('services.supabase.url'), '/') . '/storage/v1';
        $this->serviceKey = config('services.supabase.key');
    }

    public function ensureBucket(): void
    {
        Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->serviceKey,
        ])->post("{$this->baseUrl}/bucket", [
            'id' => $this->bucket,
            'public' => true,
        ]);
    }

    public function upload(UploadedFile $file, string $path): string
    {
        $this->ensureBucket();

        $contentType = $file->getMimeType() ?: 'application/octet-stream';

        Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->serviceKey,
            'Content-Type' => $contentType,
        ])->withBody(
            file_get_contents($file->getRealPath()),
            $contentType
        )->post("{$this->baseUrl}/object/{$this->bucket}/{$path}");

        return "{$this->baseUrl}/object/public/{$this->bucket}/{$path}";
    }

    public function delete(string $path): void
    {
        $this->ensureBucket();

        Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->serviceKey,
        ])->delete("{$this->baseUrl}/object/{$this->bucket}", [
            'prefixes' => [$path],
        ]);
    }
}
