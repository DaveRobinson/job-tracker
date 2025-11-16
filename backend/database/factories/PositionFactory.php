<?php

namespace Database\Factories;

use App\Models\User;
use App\PositionStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Position>
 */
class PositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $viaAgency = fake()->boolean(30);

        return [
            'user_id' => User::factory(),
            'company' => $viaAgency ? null : fake()->company(),
            'recruiter_company' => $viaAgency ? fake()->company() : null,
            'title' => fake()->jobTitle(),
            'description' => fake()->optional(0.8)->paragraph(),
            'status' => fake()->randomElement(PositionStatus::cases()),
            'location' => fake()->optional(0.9)->city(),
            'salary' => fake()->optional(0.7)->randomElement([
                '£50,000-£70,000',
                '£70,000-£90,000',
                '£90,000-£120,000',
                'Up to £50,000',
                'Up to £75,000',
                '£40k-£60k',
                '£70k-£90k',
                'Competitive',
                'GBP 50,000-70,000',
            ]),
            'url' => fake()->optional(0.6)->url(),
            'notes' => fake()->optional(0.4)->sentence(),
            'applied_at' => fake()->optional(0.5)->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
