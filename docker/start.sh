#!/bin/sh
# Container entrypoint: prepare Laravel, run migrations, then start Apache.
set -e

# Values pasted into a hosting dashboard often pick up a trailing newline,
# tab or space, which makes Laravel refuse to boot ("Invalid URI ...").
# Strip CR/LF/TAB anywhere and spaces at either end. Unset variables stay unset.
for var in APP_URL APP_KEY ASSET_URL DB_URL DATABASE_URL ADMIN_EMAIL ADMIN_PASSWORD; do
    eval "isset=\${$var+x}"
    if [ -n "$isset" ]; then
        eval "value=\$$var"
        value=$(printf '%s' "$value" | tr -d '\r\n\t' | sed -e 's/^ *//' -e 's/ *$//')
        export "$var=$value"
    fi
done

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
