FROM php:8.5-cli

# Build argument - set to "false" for production builds
ARG INSTALL_DEV=true

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first (for better caching)
COPY composer.json composer.lock ./

# Install composer dependencies WITHOUT running scripts yet
# (Scripts need artisan file which doesn't exist yet)
RUN if [ "$INSTALL_DEV" = "true" ]; then \
        echo "Installing with dev dependencies..."; \
        composer install --prefer-dist --no-scripts; \
    else \
        echo "Installing without dev dependencies (production)..."; \
        composer install --no-dev --prefer-dist --no-scripts; \
    fi

# Copy application code (NOW artisan exists)
COPY . .

# Run the post-install scripts now that artisan is available
RUN composer run-script post-autoload-dump

# Generate optimized autoload files
RUN composer dump-autoload --optimize

# Set permissions for Laravel storage and cache
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose port 8000
EXPOSE 8000

# Default command (can be overridden in docker-compose)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
