<?php

namespace Tests\Feature\Auth;

use App\Models\RecoveryCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class RecoveryCodeTest extends TestCase
{
    use RefreshDatabase;

    private function userWithCodes(string $email = 'codigos@exemplo.com'): User
    {
        $user = User::factory()->create([
            'email' => $email,
            'password' => Hash::make('senha_antiga_1'),
        ]);

        RecoveryCode::generateFor($user);

        return $user;
    }

    /**
     * Os códigos em texto puro só existem no momento da geração, então o teste
     * precisa capturá-los ali — não há como lê-los do banco depois.
     *
     * @return array<int, string>
     */
    private function generateFor(User $user): array
    {
        return RecoveryCode::generateFor($user);
    }

    public function test_recovery_codes_page_requires_authentication(): void
    {
        $this->get('/recovery-codes')->assertRedirect('/login');
    }

    public function test_recovery_codes_page_shows_the_codes_once(): void
    {
        $user = User::factory()->create();

        $codes = $this->generateFor($user);

        $this->actingAs($user)
            ->withSession(['recoveryCodes' => $codes])
            ->get('/recovery-codes')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/RecoveryCodes')
                ->has('codes', 8)
                ->where('codes.0', $codes[0]));

        // Flash dura um request: limpar a sessão simula o próximo carregamento.
        $this->flushSession();

        $this->actingAs($user)
            ->get('/recovery-codes')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/RecoveryCodes')
                ->where('codes', null));
    }

    public function test_codes_are_stored_only_as_hashes(): void
    {
        $user = User::factory()->create();
        $codes = $this->generateFor($user);

        $this->assertCount(8, $codes);

        foreach (DB::table('recovery_codes')->pluck('code_hash') as $hash) {
            $this->assertSame(64, strlen($hash));
            $this->assertNotContains($hash, $codes);
        }
    }

    public function test_password_can_be_recovered_with_a_code(): void
    {
        $user = $this->userWithCodes('recuperar@exemplo.com');
        $code = $this->generateFor($user)[0];

        $this->post('/password/recovery', [
            'email' => 'recuperar@exemplo.com',
            'recovery_code' => $code,
            'password' => 'senha_nova_1',
            'password_confirmation' => 'senha_nova_1',
        ])->assertRedirect('/login')->assertSessionHas('success');

        $this->assertTrue(Hash::check('senha_nova_1', $user->fresh()->password));
        $this->assertGuest();

        $this->post('/login', [
            'email' => 'recuperar@exemplo.com',
            'password' => 'senha_nova_1',
        ])->assertRedirect('/dashboard');
    }

    public function test_recovery_code_is_case_insensitive_and_tolerates_spaces(): void
    {
        $user = User::factory()->create(['email' => 'caixa@exemplo.com']);
        $code = $this->generateFor($user)[0];

        $this->post('/password/recovery', [
            'email' => 'CAIXA@EXEMPLO.COM',
            'recovery_code' => strtolower('  ' . $code . '  '),
            'password' => 'senha_nova_2',
            'password_confirmation' => 'senha_nova_2',
        ])->assertRedirect('/login');

        $this->assertTrue(Hash::check('senha_nova_2', $user->fresh()->password));
    }

    public function test_recovery_code_is_single_use(): void
    {
        $user = User::factory()->create(['email' => 'unica@exemplo.com']);
        $code = $this->generateFor($user)[0];

        $payload = [
            'email' => 'unica@exemplo.com',
            'recovery_code' => $code,
            'password' => 'senha_nova_3',
            'password_confirmation' => 'senha_nova_3',
        ];

        $this->post('/password/recovery', $payload)->assertRedirect('/login');
        $this->post('/logout');

        $this->post('/password/recovery', [
            ...$payload,
            'password' => 'senha_nova_4',
            'password_confirmation' => 'senha_nova_4',
        ])->assertSessionHasErrors('recovery_code');

        $this->assertTrue(Hash::check('senha_nova_3', $user->fresh()->password));
    }

    public function test_recovery_code_belongs_to_its_owner_only(): void
    {
        $owner = User::factory()->create(['email' => 'dono@exemplo.com']);
        $other = User::factory()->create([
            'email' => 'outrpessoa@exemplo.com',
            'password' => Hash::make('senha_antiga_1'),
        ]);

        $code = $this->generateFor($owner)[0];

        $this->post('/password/recovery', [
            'email' => 'outrpessoa@exemplo.com',
            'recovery_code' => $code,
            'password' => 'senha_nova_5',
            'password_confirmation' => 'senha_nova_5',
        ])->assertSessionHasErrors('recovery_code');

        $this->assertTrue(Hash::check('senha_antiga_1', $other->fresh()->password));
    }

    public function test_unknown_code_is_rejected(): void
    {
        User::factory()->create(['email' => 'errado@exemplo.com']);

        $this->post('/password/recovery', [
            'email' => 'errado@exemplo.com',
            'recovery_code' => 'AAAA-BBBB-CCCC-DDDD',
            'password' => 'senha_nova_6',
            'password_confirmation' => 'senha_nova_6',
        ])->assertSessionHasErrors('recovery_code');

        $this->assertGuest();
    }

    public function test_recovery_flow_does_not_reveal_whether_the_account_exists(): void
    {
        $this->userWithCodes('existe@exemplo.com');

        $unknown = $this->post('/password/recovery', [
            'email' => 'naoexiste@exemplo.com',
            'recovery_code' => 'AAAA-BBBB-CCCC-DDDD',
            'password' => 'senha_nova_7',
            'password_confirmation' => 'senha_nova_7',
        ]);

        $known = $this->post('/password/recovery', [
            'email' => 'existe@exemplo.com',
            'recovery_code' => 'AAAA-BBBB-CCCC-DDDD',
            'password' => 'senha_nova_7',
            'password_confirmation' => 'senha_nova_7',
        ]);

        $this->assertSame(
            $unknown->getSession()->get('errors')->first('recovery_code'),
            $known->getSession()->get('errors')->first('recovery_code')
        );
    }

    public function test_recovery_flow_validates_the_payload(): void
    {
        $this->post('/password/recovery', [
            'email' => 'nao-e-email',
            'recovery_code' => '',
            'password' => 'curta',
            'password_confirmation' => 'outra',
        ])->assertSessionHasErrors(['email', 'recovery_code', 'password']);
    }

    public function test_regenerating_codes_requires_the_password(): void
    {
        $user = $this->userWithCodes('regenerar@exemplo.com');

        $this->actingAs($user)
            ->post('/settings/recovery-codes', ['password' => 'senha_errada'])
            ->assertSessionHasErrors('password');

        $this->actingAs($user)
            ->post('/settings/recovery-codes', ['password' => 'senha_antiga_1'])
            ->assertRedirect('/recovery-codes')
            ->assertSessionHas('recoveryCodes');

        $this->assertSame(8, $user->recoveryCodes()->count());
    }

    public function test_regenerating_codes_invalidates_the_previous_ones(): void
    {
        $user = User::factory()->create([
            'email' => 'trocar@exemplo.com',
            'password' => Hash::make('senha_antiga_1'),
        ]);

        $old = $this->generateFor($user)[0];

        $response = $this->actingAs($user)
            ->post('/settings/recovery-codes', ['password' => 'senha_antiga_1']);

        $new = $response->getSession()->get('recoveryCodes')[0];

        $this->assertNotSame($old, $new);

        // /password/recovery é rota de convidado: sai da sessão antes de testá-la.
        $this->post('/logout');

        $this->post('/password/recovery', [
            'email' => 'trocar@exemplo.com',
            'recovery_code' => $old,
            'password' => 'senha_nova_8',
            'password_confirmation' => 'senha_nova_8',
        ])->assertSessionHasErrors('recovery_code');

        $this->post('/password/recovery', [
            'email' => 'trocar@exemplo.com',
            'recovery_code' => $new,
            'password' => 'senha_nova_8',
            'password_confirmation' => 'senha_nova_8',
        ])->assertRedirect('/login');
    }

    public function test_codes_are_deleted_with_the_user(): void
    {
        $user = $this->userWithCodes('some@exemplo.com');

        $user->delete();

        $this->assertSame(0, DB::table('recovery_codes')->count());
    }

    public function test_login_page_hides_the_email_flow_when_smtp_is_not_configured(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/Login')
                ->where('canEmailReset', false));
    }

    public function test_login_page_shows_the_email_flow_when_smtp_is_configured(): void
    {
        config([
            'mail.mailers.smtp.host' => 'smtp-relay.brevo.com',
            'mail.mailers.smtp.username' => 'smtp@exemplo.com',
        ]);

        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Auth/Login')
                ->where('canEmailReset', true));
    }
}
