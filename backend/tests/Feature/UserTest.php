<?php

namespace Tests\Feature;

use App\Models\Position;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_all_users(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create();

        $response = $this->actingAs($adminUser)
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonCount(4)  // 3 + admin
            ->assertJsonStructure([
                '*' => ['id', 'name', 'email', 'is_admin']
            ]);
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_view_user_positions(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create();

        Position::factory()->count(3)->for($targetUser)->create();

        $response = $this->actingAs($adminUser)
            ->getJson("/api/users/{$targetUser->id}/positions");

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonStructure([
                '*' => ['id', 'title', 'user' => ['id', 'name']]
            ]);
    }

    public function test_non_admin_cannot_view_other_user_positions(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        Position::factory()->count(3)->for($targetUser)->create();

        $response = $this->actingAs($user)
            ->getJson("/api/users/{$targetUser->id}/positions");

        $response->assertStatus(403);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/users');
        $response->assertStatus(401);

        $user = User::factory()->create();
        $response = $this->getJson("/api/users/{$user->id}/positions");
        $response->assertStatus(401);
    }
}
