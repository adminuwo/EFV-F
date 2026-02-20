FROM nginx:alpine

# Install bash for the entrypoint script (alpine uses ash/sh but bash is safer for complex scripts, though sh is fine for cat)
# Actually sh is fine.

# Copy static assets
COPY . /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.d/99-api-config.sh
RUN chmod +x /docker-entrypoint.d/99-api-config.sh

# Expose port
EXPOSE 8080
