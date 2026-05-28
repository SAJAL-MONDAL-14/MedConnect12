# ─── Serve pre-built assets ───────────────────────────────────────────────────
# This Dockerfile expects `dist/` to already exist from running:
#   npm install && npm run build   (on the Windows host)
#
# This avoids Docker Desktop for Windows MTU/OpenSSL networking issues
# that cause ERR_SSL_CIPHER_OPERATION_FAILED during npm install inside containers.
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the pre-built Vite output
COPY dist/ /usr/share/nginx/html/

# SPA routing + gzip + asset caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
