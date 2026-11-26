<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database. Idempotent: safe to run on every deploy.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProductSeeder::class,
            DemoOrderSeeder::class,
        ]);
    }
}
