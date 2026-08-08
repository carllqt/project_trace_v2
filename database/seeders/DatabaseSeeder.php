<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        // User::factory(10)->create();
        $this->call([
            DepartmentSeeder::class,
            UserSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => '123@example.com',
            'password' => bcrypt('123'),
            'department_id' => 5, // Assign a department ID

        ]);
        $user->assignRole('user');

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('123'),
        ]);
        $admin->assignRole('admin');
    }
}
