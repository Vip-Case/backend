# Dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

CMD ["bun", "run", "--watch", "src/index.ts"]