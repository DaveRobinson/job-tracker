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
        Position::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/positions');

        $response->assertStatus(200)
            ->assertJsonCount(3);
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
            ]);

        $this->assertDatabaseHas('positions', [
            'company' => 'Test Company',
            'title' => 'Software Engineer',
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
        $position = Position::factory()->create([
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

    public function test_can_delete_position(): void
    {
        $position = Position::factory()->create();

        $response = $this->actingAs($this->user)
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
}
