<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class SupabaseStorageService
{
    private string $bucket;

    private string $baseUrl;

    private string $serviceKey;

    private static bool $bucketEnsured = false;

    public function __construct()
    {
        $this->bucket = 'avatars';
        $this->baseUrl = rtrim(config('services.supabase.url'), '/').'/storage/v1';
        $this->serviceKey = config('services.supabase.key');
    }

    public function ensureBucket(): void
    {
        if (static::$bucketEnsured) {
            return;
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->serviceKey,
        ])->post("{$this->baseUrl}/bucket", [
            'id' => $this->bucket,
            'name' => $this->bucket,
            'public' => true,
        ]);

        if (! $response->successful()
            && $response->status() !== 409
            && ! str_contains($response->body(), 'BucketAlreadyExists')) {
            throw new \RuntimeException('Supabase Storage bucket: '.($response->body() ?: $response->status()));
        }

        static::$bucketEnsured = true;
    }

    public function upload(UploadedFile $file, string $path): string
    {
        $this->ensureBucket();

        $contentType = $file->getMimeType() ?: 'application/octet-stream';

        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->serviceKey,
            'Content-Type' => $contentType,
        ])->withBody(
            file_get_contents($file->getRealPath()),
            $contentType
        )->post("{$this->baseUrl}/object/{$this->bucket}/{$path}");

        if (! $response->successful()) {
            throw new \RuntimeException('Supabase Storage upload: '.($response->body() ?: $response->status()));
        }

        return "{$this->baseUrl}/object/public/{$this->bucket}/{$path}";
    }

    public function delete(string $path): void
    {
        $this->ensureBucket();

        Http::withHeaders([
            'Authorization' => 'Bearer '.$this->serviceKey,
        ])->delete("{$this->baseUrl}/object/{$this->bucket}", [
            'prefixes' => [$path],
        ]);
    }
}
