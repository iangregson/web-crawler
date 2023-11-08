# spider-monzo

A simple web crawler. 

> **NOTE** this is my submission for Monzo's technical test. I passed.

### Contents

* [Problem](#problem)
* [Requirements](#requirements)
* [Scope and limitations](#scope-and-limitations)
* [Crawling](#crawling)
  * [With Docker](#with-docker)
  * [With Bun](#with-bun)
* [Trade-offs](#trade-offs)
* [Future Work](#future-work)
* [Journal](#journal)


### Problem

> We'd like you to write a simple web crawler in a programming language you're familiar with. Given a starting URL, the crawler should visit each URL it finds on the same domain. It should print each URL visited, and a list of links found on that page. The crawler should be limited to one subdomain - so when you start with *https://monzo.com/*, it would crawl all pages on the monzo.com website, but not follow external links, for example to facebook.com or community.monzo.com.

> We would like to see your own implementation of a web crawler. Please do not use frameworks like scrapy or go-colly which handle all the crawling behind the scenes or someone else's code. You are welcome to use libraries to handle things like HTML parsing.

> Ideally, write it as you would a production piece of code. This exercise is not meant to show us whether you can write code – we are more interested in how you design software. This means that we care less about a fancy UI or sitemap format, and more about how your program is structured: the trade-offs you've made, what behaviour the program exhibits, and your use of concurrency, test coverage, and so on.


### Requirements

* MUST accept a URL as input
* MUST print each URL it visits
* MUST parse a list of linked URLs from the current URL
  * MUST print that list
* MUST not visit external URLs


### Scope and limitations

* User input must be a single, fully qualified URL
* User input errors will cause a non-zero exit code with a helpful message to stderr
* HTML parsing errors will be handled and print a warning message to stderr
* Uncaught exceptions will cause a non-zero exit code with an "Unexpected error" message to stderr.
* Each URL visited will be printed to stdout
* URLs should only be visited once
* Only links in anchor `<a>` tags will be parsed
* Only URLs that locate content with header `Content-Type: text/html` will be parsed
* Using the [built-in](https://bun.sh/docs/runtime/nodejs-apis#node-url) [URL](https://nodejs.org/api/url.html) module for URL validation 
* Using built-in [fetch](https://bun.sh/guides/http/fetch) for network requests
* Using [cheerio](https://github.com/jsdom/jsdom) for HTML parsing
* Using [p-queue](https://github.com/sindresorhus/p-queue) for async queueing
* Using [commander](https://github.com/tj/commander.js) for CLI wrapper
* URL visit tasks that take longer than 5 seconds will be aborted

## Just let me run it...

So by now you just want to run the thing, right? Let's go.

### Crawling

#### With Docker

Requires:
- Make
- Docker (and Compose)

```bash
make docker
```

This will drop you in a bash shell with the crawler built to `bin/spider-monzo`.

So in that shell you can use it like 

```bash
$ bin/spider-monzo --help
Usage: spider-monzo [options] [command]

A simple web crawler

Options:
  -V, --version          output the version number
  -h, --help             display help for command

Commands:
  crawl [options] <url>  Given a starting URL, visit and print each URL - and a list of its links - found on the same domain.
  help [command]         display help for command
```

Or run the tests like

```bash
bun test
```

#### With Bun

Requires:
- Make
- Bun

First, install dependencies and build the app.

```bash
make
```

This builds the crawler to `bin/spider-monzo` so you can use it like


```bash
$ bin/spider-monzo --help
Usage: spider-monzo [options] [command]

A simple web crawler

Options:
  -V, --version          output the version number
  -h, --help             display help for command

Commands:
  crawl [options] <url>  Given a starting URL, visit and print each URL - and a list of its links - found on the same domain.
  help [command]         display help for command
```

Or run the tests like

```bash
bun test
```

## Let's talk

### Trade-offs

* Choice of `cheerio` for html parsing
  - it's fast and convenient
  - but it's not the fastest, or full HTML spec compliant
* Time out URL visit tasks after 5 seconds
  - without a timeout we fail the crawler-test.com 
  - but 5 seconds is pretty arbitrary
* Why not parse and filter for same host links in `parser.parseLinks()`?
* Using an async queue
  - why not just Promise.all()


### Future Work

* Offer a parellism option by running multiple copies in forked mode
  - Need to add a in-memory cache (e.g. Redis) to hold the `queue` and `seen`
* Don't parse pages twice - use a cache (especially for in-page anchors)
* More deliberate (data-driven) choice of HTML parser
* Better validation of URLs to prevent unnecessary failed network requests
* Better / more descriptive wording in the tests (there's always room for better tests and docs, right?)
* Full support for crawler-test.com (fails on canonical trailing dot)


## Notes

### Journal

* Friday PM :: boilerplate, cli, readme :: ~1hr
* Sunday AM :: urls, parsing, tests :: ~1hrs
* Sunday PM :: crawler implementation, e2e test :: ~2hrs
* Monday AM :: tidy up, finish documentation :: <1hr

### Times

```bash
$ bin/spider-monzo crawl http://crawler-test.com -c 1
...
real    2m46.696s
user    0m9.840s
sys     0m6.142s
```

```bash
$ bin/spider-monzo crawl http://crawler-test.com -c 64
...
real    0m27.087s
user    0m6.910s
sys     0m4.476s
```

```bash
$ bin/spider-monzo crawl http://monzo.com -c 1
...
real    9m47.370s
user    1m11.336s
sys     0m38.053s
```

```bash
$ bin/spider-monzo crawl http://monzo.com -c 64
...
real    3m35.102s
user    2m39.119s
sys     1m38.663s
```
