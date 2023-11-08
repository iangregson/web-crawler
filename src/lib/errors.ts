export enum CrawlerErrorType {
  INVALID_URL,
  FETCH,
  PARSE
}

export class CrawlerError extends Error {
  public type: CrawlerErrorType;

  constructor(type: CrawlerErrorType, message: string) {
    super(message);
    this.type = type;
  }

  static invalidUrl(message: string = "Invalid URL"): CrawlerError {
    return new CrawlerError(CrawlerErrorType.INVALID_URL, message);
  }

  static fetch(message: string = "Could not fetch"): CrawlerError {
    return new CrawlerError(CrawlerErrorType.FETCH, message);
  }

  static parse(message: string = "Could not parse links from html"): CrawlerError {
    return new CrawlerError(CrawlerErrorType.PARSE, message);
  }
}