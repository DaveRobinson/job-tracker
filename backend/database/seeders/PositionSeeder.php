<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assumes AdminUserSeeder has run first
        $adminUser = User::first();

        if ($adminUser) {
            Position::factory()->count(20)->for($adminUser)->create();
            $this->command->info("Created 20 positions for {$adminUser->email}");
        }
    }
}
