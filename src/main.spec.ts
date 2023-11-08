import { beforeAll, describe, expect, test } from "bun:test";
const { stat } = require("fs").promises;
import { Crawler } from "./crawler";

beforeAll(() => {
  // static file server
  Bun.serve({
    port: 3000,
    async fetch(req) {
      const basepath = import.meta.dir + '/test-fixtures/html';
      let path = new URL(req.url).pathname;
      path = basepath + path + 'index.html'
      // Throw if file not found and trigger error handler
      const _ = await stat(path);
      const file = Bun.file(path);
      return new Response(file);
    },
    error() {
      return new Response(null, { status: 404 });
    }
  });
});

describe('main', () => {
  test('crawl http://localhost:3000 : concurrency 1', async () => {
    const crawler = new Crawler('http://localhost:3000', { concurrency: 1 });
    
    let maxConcurrentJobs = 0;
    crawler.queue.on('completed', () => {
      maxConcurrentJobs = Math.max(maxConcurrentJobs, crawler.queue.pending);
    })
    
    await crawler.crawl();
    expect(maxConcurrentJobs).toEqual(1);
    expect(crawler.visitedCount).toEqual(5);
  });
  
  test('crawl http://localhost:3000 : concurrency 2', async () => {
    const crawler = new Crawler('http://localhost:3000', { concurrency: 2 });
    
    let maxConcurrentJobs = 0;
    crawler.queue.on('completed', () => {
      maxConcurrentJobs = Math.max(maxConcurrentJobs, crawler.queue.pending);
    })
    
    await crawler.crawl();
    
    expect(maxConcurrentJobs).toEqual(2);
    expect(crawler.visitedCount).toEqual(5);
  });
  
  test('crawl http://localhost:3000 : concurrency 16', async () => {
    const crawler = new Crawler('http://localhost:3000', { concurrency: 16 });
    
    let maxConcurrentJobs = 0;
    crawler.queue.on('completed', () => {
      maxConcurrentJobs = Math.max(maxConcurrentJobs, crawler.queue.pending);
    })
    
    await crawler.crawl();
    
    expect(maxConcurrentJobs).toBeLessThanOrEqual(16);
    expect(crawler.visitedCount).toEqual(5);
  });
  
  test('crawl http://localhost:3000 : concurrency 64', async () => {
    const crawler = new Crawler('http://localhost:3000', { concurrency: 64 });
    
    let maxConcurrentJobs = 0;
    crawler.queue.on('completed', () => {
      maxConcurrentJobs = Math.max(maxConcurrentJobs, crawler.queue.pending);
    })
    
    await crawler.crawl();
    
    expect(maxConcurrentJobs).toBeLessThanOrEqual(64);
    expect(crawler.visitedCount).toEqual(5);
  });
  
  test('crawl http://crawler-test.com : concurrency 64', async () => {
    const crawler = new Crawler('http://crawler-test.com', { concurrency: 64 });
    
    let maxConcurrentJobs = 0;
    crawler.queue.on('completed', () => {
      maxConcurrentJobs = Math.max(maxConcurrentJobs, crawler.queue.pending);
    })
    
    await crawler.crawl();
    
    expect(maxConcurrentJobs).toBeLessThanOrEqual(64);
  }, { timeout: 180000 });
});