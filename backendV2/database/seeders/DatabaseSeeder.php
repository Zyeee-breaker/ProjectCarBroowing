<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed user default
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('12341234'), // jangan lupa hash password
            'role' => 'admin', // bisa diganti customer/staff sesuai kebutuhan
        ]);
        User::factory()->create([
            'name' => 'Test User Staff',
            'email' => 'test2@gmail.com',
            'password' => Hash::make('12341234'), // jangan lupa hash password
            'role' => 'staff', // bisa diganti customer/staff sesuai kebutuhan
        ]);
        
        User::factory()->create([
            'name' => 'Test User customer',
            'email' => 'test1@gmail.com',
            'password' => Hash::make('12341234'), // jangan lupa hash password
            'role' => 'customer', // bisa diganti customer/staff sesuai kebutuhan
        ]);

        // 2. Seed user tambahan via factory
        User::factory(10)->create();
    }
}
