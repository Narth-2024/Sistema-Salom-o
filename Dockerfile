FROM php:8.2-cli

ARG PORT=10000
ENV PORT=$PORT

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql bcmath zip

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /opt/render/project/src

# Copy project files
COPY . .

# Install dependencies and build
RUN composer install --no-dev --optimize-autoloader \
    && npm ci \
    && npm run build \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE $PORT

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
