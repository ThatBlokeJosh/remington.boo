FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --prefer-offline --no-audit --progress=false && npm run build

FROM lipanski/docker-static-website:latest
COPY --from=builder /app/build/ .
CMD ["/busybox-httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
