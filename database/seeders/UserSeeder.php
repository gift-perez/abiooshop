<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Create (or update) the admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
     * Safe to run on every deploy.
     */
    public function run(): void
    {
        $email = config('shop.admin.email');
        $password = config('shop.admin.password');

        $existing = User::where('email', $email)->first();

        if (! $password) {
            if ($existing) {
                return; // Keep the current password.
            }

            $password = Str::password(16, symbols: false);
            $this->command?->warn("ADMIN_PASSWORD not set. Generated admin password for {$email}: {$password}");
        }

        $admin = $existing ?? new User(['email' => $email]);
        $admin->name = $admin->name ?: 'Admin';
        $admin->password = $password; // hashed by the model cast
        $admin->forceFill(['role' => 'admin', 'email_verified_at' => $admin->email_verified_at ?? now()]);
        $admin->save();
    }
}
