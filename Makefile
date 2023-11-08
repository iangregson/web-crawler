all: build

clean:
	rm bin/* || true
	rm -rf node_modules || true

install:
	bun install

build: clean install
	bun build --target=bun src/main.ts --compile --outfile bin/spider-monzo

test:
	bun test

docker:
  # will drop you into an interactive shell with the program built to bin/spider-monzo
	docker compose run --build --rm app bash

