export namespace urls {
  export function validUrl(urlString: string, baseUrl?: URL): Optional<URL> {  
    try {
      const url = new URL(urlString, baseUrl);
      return url;
    } catch (_) {
      return null;
    }
  }
  
  export function sameHost(baseUrl: URL, targetUrl: URL): Boolean {
    return baseUrl.host === targetUrl.host;
  }
  
  export function externalHost(baseUrl: URL, targetUrl: URL): Boolean {
    return !sameHost(baseUrl, targetUrl);
  }
}