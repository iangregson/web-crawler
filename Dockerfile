FROM oven/bun:1.0.3-slim

COPY package.json ./
COPY bun.lockb ./
COPY src ./src

RUN bun install
RUN bun build --target=bun src/main.ts --compile --outfile bin/spider-monzo