import { Command } from 'commander';
import { Crawler } from './crawler';
import { CrawlerError } from './lib';

async function main(): Promise<void> {  
  const program = new Command();

  program
    .name('spider-monzo')
    .description('A simple web crawler')
    .version('0.0.1');

  program.command('crawl')
    .description('Given a starting URL, visit and print each URL - and a list of its links - found on the same domain.')
    .argument('<url>', 'fully qualified starting URL')
    .option('-c, --concurrency <number>', 'number of URLs to visit concurrently', '1')
    .action(async (url: string, options: { concurrency: number }) => {
      const crawler = new Crawler(url, { concurrency: Number(options.concurrency) });
      await crawler.crawl();
    });
  
  await program.parseAsync();
}

function exit(): void {
  process.exit(0);
}

function errorHandler(error: CrawlerError | Error): void {
  if (error instanceof CrawlerError) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error("Unexpected error.");
  }
  process.exit(1);
}

main()
  .then(exit)
  .catch(errorHandler);

