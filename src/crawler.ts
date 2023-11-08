import PQueue from 'p-queue';
import { CrawlerError, urls, parser } from './lib';

export class Crawler {
  private url: string;
  private concurrency: number = 1;
  private seen: Set<string> = new Set();
  private visited: Set<string> = new Set();
  public queue: PQueue;
  
  constructor(url: string, options?: { concurrency: number }) {
    this.url = url;
    if (options?.concurrency) {
      this.concurrency = options.concurrency;
    }
    this.queue = new PQueue({
      concurrency: this.concurrency,
      autoStart: false,
      timeout: 5000,
    });
  }

  public get visitedCount(): number {
    return this.visited.size;
  }
  
  public async crawl(): Promise<void> {
    const baseUrl = urls.validUrl(this.url);
    if (!baseUrl) {
      throw CrawlerError.invalidUrl(`${this.url} is not valid. Please use fully qualified urls e.g. https://monzo.com`);
    }
    
    const visit = (url: URL) => async () => {
      if (!url) return;

      if (this.seen.has(`${url}`)) return;
 
      let page: string = "";
      try {
        const response = await fetch(url);
        this.seen.add(`${url}`);
        
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
          page = await response.text();
          this.visited.add(`${url}`);
        } else {
          return;
        }
      } catch(_) {
        const err = CrawlerError.fetch(`Could not fetch ${url}`);
        console.error(err.message);
      }

      const links = parser.parseLinks(page, baseUrl);
      console.log(`\n${JSON.stringify({ url, links }, null, 2)}`);
      for (const link of links) {
        if (!this.seen.has(`${link}`) && urls.sameHost(baseUrl, link)) {
          this.queue.add(visit(link));
        }
      }
    };

    this.queue.add(visit(baseUrl));
    await this.queue.start(); 
    await this.queue.onIdle();
  }
}
