<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('email', 'admin@example.com')->exists()) {
            $this->command->info('Admin user already exists.');
            return;
        }

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        $this->command->info('✓ Admin user created');
        $this->command->warn('  Email: admin@example.com');
        $this->command->warn('  Password: password (from factory default)');
    }
}
