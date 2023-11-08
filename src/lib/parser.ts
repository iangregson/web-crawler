import { CrawlerError } from '.';
import { urls } from './urls';
import * as cheerio from 'cheerio';

export namespace parser {
  export function parseLinks(htmlString: string, baseUrl: URL): URL[] {
    let $: cheerio.CheerioAPI;
    let $a: cheerio.Cheerio<cheerio.Element>;
    
    try {
      $ = cheerio.load(htmlString);
      $a = $('a');
    } catch (_) {
      const err = CrawlerError.parse();
      console.error(err.message);
      return [];
    }

    const linkedUrls: URL[] = [];
    $a.each((_: number, node: cheerio.Element) => {
      const href = node.attribs['href'];
      const url = urls.validUrl(href, baseUrl);
      if (url) {
        linkedUrls.push(url);
      }
    });

    return linkedUrls;
  }
}