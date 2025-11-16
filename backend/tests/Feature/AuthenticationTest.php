<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email', 'is_admin'],
            ]);
    }

    public function test_login_response_does_not_leak_sensitive_fields(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonMissing(['password'])
            ->assertJsonMissing(['remember_token']);

        // Also verify the user object specifically doesn't contain these
        $this->assertArrayNotHasKey('password', $response->json('user'));
        $this->assertArrayNotHasKey('remember_token', $response->json('user'));
    }

    public function test_login_includes_is_admin_flag(): void
    {
        $adminUser = User::factory()->create([
            'password' => bcrypt('password123'),
            'is_admin' => true,
        ]);

        $regularUser = User::factory()->create([
            'password' => bcrypt('password123'),
            'is_admin' => false,
        ]);

        // Test admin user
        $response = $this->postJson('/api/login', [
            'email' => $adminUser->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'is_admin' => true,
                ],
            ]);

        // Test regular user
        $response = $this->postJson('/api/login', [
            'email' => $regularUser->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'is_admin' => false,
                ],
            ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_endpoint_returns_correct_structure(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'is_admin',
                'created_at',
                'updated_at',
            ])
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => true,
            ]);
    }

    public function test_user_endpoint_does_not_leak_sensitive_fields(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonMissing(['password'])
            ->assertJsonMissing(['remember_token']);

        // Verify the response doesn't contain these keys
        $this->assertArrayNotHasKey('password', $response->json());
        $this->assertArrayNotHasKey('remember_token', $response->json());
    }
}