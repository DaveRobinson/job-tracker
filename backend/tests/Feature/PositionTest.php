<?php

namespace Tests\Feature;

use App\Models\Position;
use App\Models\User;
use App\PositionStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PositionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_list_positions(): void
    {
        Position::factory()->count(3)->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/positions');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_users_only_see_their_own_positions(): void
    {
        // Create positions for the authenticated user
        Position::factory()->count(2)->for($this->user)->create();

        // Create positions for another user
        $otherUser = User::factory()->create();
        Position::factory()->count(3)->for($otherUser)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/positions');

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_admin_sees_own_positions_by_default(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);

        // Create positions for various users
        Position::factory()->count(2)->for($this->user)->create();
        Position::factory()->count(3)->for($adminUser)->create();

        $response = $this->actingAs($adminUser)
            ->getJson('/api/positions');

        $response->assertStatus(200)
            ->assertJsonCount(3);  // Admin sees only their own by default
    }

    public function test_can_create_position(): void
    {
        $data = [
            'company' => 'Test Company',
            'title' => 'Software Engineer',
            'status' => 'saved',
            'location' => 'London',
            'salary' => '£70,000',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/positions', $data);

        $response->assertStatus(201)
            ->assertJson([
                'company' => 'Test Company',
                'title' => 'Software Engineer',
                'user_id' => $this->user->id,
            ]);

        $this->assertDatabaseHas('positions', [
            'company' => 'Test Company',
            'title' => 'Software Engineer',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_requires_either_company_or_recruiter(): void
    {
        $data = [
            'title' => 'Software Engineer',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/positions', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['company', 'recruiter_company']);
    }

    public function test_can_update_position(): void
    {
        $position = Position::factory()->for($this->user)->create([
            'company' => 'Old Company',
            'title' => 'Old Title',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/positions/{$position->id}", [
                'company' => 'New Company',
                'title' => 'New Title',
                'status' => 'applied',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'company' => 'New Company',
                'title' => 'New Title',
            ]);

        $this->assertDatabaseHas('positions', [
            'id' => $position->id,
            'company' => 'New Company',
            'title' => 'New Title',
        ]);
    }

    public function test_cannot_update_other_users_position(): void
    {
        $otherUser = User::factory()->create();
        $position = Position::factory()->for($otherUser)->create([
            'company' => 'Old Company',
            'title' => 'Old Title',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/positions/{$position->id}", [
                'company' => 'New Company',
                'title' => 'New Title',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_any_position(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $position = Position::factory()->for($this->user)->create([
            'company' => 'Old Company',
            'title' => 'Old Title',
        ]);

        $response = $this->actingAs($adminUser)
            ->putJson("/api/positions/{$position->id}", [
                'company' => 'New Company',
                'title' => 'New Title',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'company' => 'New Company',
                'title' => 'New Title',
            ]);
    }

    public function test_can_delete_position(): void
    {
        $position = Position::factory()->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/positions/{$position->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('positions', [
            'id' => $position->id,
        ]);
    }

    public function test_cannot_delete_other_users_position(): void
    {
        $otherUser = User::factory()->create();
        $position = Position::factory()->for($otherUser)->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/positions/{$position->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('positions', [
            'id' => $position->id,
        ]);
    }

    public function test_admin_can_delete_any_position(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $position = Position::factory()->for($this->user)->create();

        $response = $this->actingAs($adminUser)
            ->deleteJson("/api/positions/{$position->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('positions', [
            'id' => $position->id,
        ]);
    }

    public function test_validates_status_enum(): void
    {
        $data = [
            'company' => 'Test Company',
            'title' => 'Software Engineer',
            'status' => 'invalid_status',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/positions', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/positions');
        $response->assertStatus(401);

        $response = $this->postJson('/api/positions', []);
        $response->assertStatus(401);
    }

    public function test_admin_can_view_all_users_positions(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Position::factory()->count(2)->for($user1)->create();
        Position::factory()->count(3)->for($user2)->create();

        $response = $this->actingAs($adminUser)
            ->getJson('/api/positions?all_users=true');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_admin_can_filter_by_user_id(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Position::factory()->count(2)->for($user1)->create();
        Position::factory()->count(3)->for($user2)->create();

        $response = $this->actingAs($adminUser)
            ->getJson("/api/positions?user_id={$user1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_non_admin_cannot_use_all_users_filter(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Position::factory()->count(2)->for($user1)->create();
        Position::factory()->count(3)->for($user2)->create();

        $response = $this->actingAs($user1)
            ->getJson('/api/positions?all_users=true');

        $response->assertStatus(200)
            ->assertJsonCount(2);  // Should only see their own
    }

    public function test_admin_can_create_position_for_another_user(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);
        $targetUser = User::factory()->create();

        $response = $this->actingAs($adminUser)
            ->postJson('/api/positions', [
                'user_id' => $targetUser->id,
                'company' => 'Test Company',
                'title' => 'Software Engineer',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'user_id' => $targetUser->id,
                'company' => 'Test Company',
            ]);

        $this->assertDatabaseHas('positions', [
            'user_id' => $targetUser->id,
            'company' => 'Test Company',
        ]);
    }

    public function test_non_admin_cannot_specify_user_id(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $response = $this->actingAs($user1)
            ->postJson('/api/positions', [
                'user_id' => $user2->id,
                'company' => 'Test Company',
                'title' => 'Software Engineer',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['user_id']);
    }

    public function test_position_responses_include_user_data(): void
    {
        $position = Position::factory()->for($this->user)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/positions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'title', 'user' => ['id', 'name']]
            ]);
    }
}
