<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecoveryCode extends Model
{
    protected $fillable = [
        'user_id',
        'code_hash',
        'used_at',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * HMAC-SHA256 com o APP_KEY em vez de bcrypt: permite buscar o código por
     * igualdade numa única query. É seguro porque cada código tem ~80 bits de
     * entropia — a força bruta é inviável mesmo com hash rápido.
     */
    public static function hash(string $code): string
    {
        return hash_hmac('sha256', strtoupper(trim($code)), config('app.key'));
    }

    /**
     * Substitui todos os códigos do usuário por um lote novo e devolve os
     * códigos em texto puro. Só este retorno conhece o valor: no banco fica
     * apenas o hash.
     *
     * @return array<int, string>
     */
    public static function generateFor(User $user, int $count = 8): array
    {
        static::where('user_id', $user->id)->delete();

        $codes = [];

        while (count($codes) < $count) {
            $code = static::makeCode();
            $hash = static::hash($code);

            if (static::where('code_hash', $hash)->exists()) {
                continue;
            }

            static::create([
                'user_id' => $user->id,
                'code_hash' => $hash,
            ]);

            $codes[] = $code;
        }

        return $codes;
    }

    public static function makeCode(): string
    {
        // Alfabeto sem I, L, O, 0 e 1 para não gerar confusão ao digitar.
        $alphabet = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';

        $raw = '';
        for ($i = 0; $i < 16; $i++) {
            $raw .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }

        return implode('-', str_split($raw, 4));
    }
}
