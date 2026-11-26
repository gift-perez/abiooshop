#!/bin/sh
# Container entrypoint: prepare Laravel, run migrations, then start Apache.
set -e

cd /var/www/html

if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Generate one with: php artisan key:generate --show" >&2
    exit 1
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Safe to run on every boot: migrations only apply new changes, seeders are idempotent.
php artisan migrate --force
php artisan db:seed --force

exec apache2-foreground
