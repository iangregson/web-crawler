import { describe, expect, test } from "bun:test";
import { urls } from './urls';

describe("validUrl", () => {
  test("empty string", () => {
    const url = urls.validUrl("");
    expect(url).toBeNull();
  });
  
  test("monzo.com", () => {
    const url = urls.validUrl('monzo.com');
    expect(url).toBeNull();
  });
  
  test("http://monzo.com", () => {
    const url = urls.validUrl('http://monzo.com');
    expect(url).toBeInstanceOf(URL);
    expect(url?.toString()).toEqual('http://monzo.com/');
  });
  
  test("http://some-subdomain.monzo.com", () => {
    const url = urls.validUrl('http://some-subdomain.monzo.com');
    expect(url).toBeInstanceOf(URL);
    expect(url?.toString()).toEqual('http://some-subdomain.monzo.com/');
  });
  
  test("http://bad subdomain.monzo.com", () => {
    const url = urls.validUrl('http://bad subdomain.monzo.com');
    expect(url).toBeNull();
  });
  
  test("http://monzo.com/somewhere?odd *&^4 ; Query=123", () => {
    const url = urls.validUrl('http://monzo.com/somewhere?bad *&^4 ; Query=123');
    expect(url?.hostname).toEqual('monzo.com')
  });

  test("http://monzo.com/docs/some-page#with-anchor", () => {
    const url = urls.validUrl('http://monzo.com/docs/some-page#with-anchor');
    expect(url).toBeInstanceOf(URL);
    expect(url?.toString()).toEqual('http://monzo.com/docs/some-page#with-anchor');
  });
});

describe("validUrl (relative)", () => {
  test("empty string", () => {
    const url = urls.validUrl("");
    expect(url).toBeNull();
  });
  
  test("/", () => {
    const url = urls.validUrl('/');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('/', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://relative.com/');
  });
  
  test("/somewhere", () => {
    const url = urls.validUrl('/somewhere');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('/somewhere', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://relative.com/somewhere');
  });
 
  test("/some-image.png", () => {
    const url = urls.validUrl('/some-image.png');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('/some-image.png', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://relative.com/some-image.png');
  });
 
  test("/some-audio.mp3", () => {
    const url = urls.validUrl('/some-audio.mp3');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('/some-audio.mp3', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://relative.com/some-audio.mp3');
  });
 
  test("#some-anchor", () => {
    const url = urls.validUrl('#some-anchor');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('#some-anchor', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://relative.com/#some-anchor');
  });
  
  test("////too-many-slashes", () => {
    const url = urls.validUrl('////too-many-slashes');
    expect(url).toBeNull();
    
    const relativeUrl = urls.validUrl('////too-many-slashes', new URL('http://relative.com'));
    expect(relativeUrl?.toString()).toEqual('http://too-many-slashes/');
  });  
});

describe("sameHost", () => { 
  test("http://monzo.com != http://google.com", () => {
    const baseUrl = urls.validUrl('http://monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://google.com');
    expect(targetUrl).toBeTruthy();
    const isSameHost = urls.sameHost(baseUrl!, targetUrl!);
    expect(isSameHost).toBeFalse();
  });
  
  test("http://some-subdomain.monzo.com != http://some-subdomain.google.com", () => {
    const baseUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://some-subdomain.google.com');
    expect(targetUrl).toBeTruthy();
    const isSameHost = urls.sameHost(baseUrl!, targetUrl!);
    expect(isSameHost).toBeFalse();
  });
  
  test("http://monzo.com == http://monzo.com", () => {
    const baseUrl = urls.validUrl('http://monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://monzo.com');
    expect(targetUrl).toBeTruthy();
    const isSameHost = urls.sameHost(baseUrl!, targetUrl!);
    expect(isSameHost).toBeTrue();
  });
  
  test("http://some-subdomain.monzo.com == http://some-subdomain.monzo.com", () => {
    const baseUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(targetUrl).toBeTruthy();
    const isSameHost = urls.sameHost(baseUrl!, targetUrl!);
    expect(isSameHost).toBeTrue();
  });
});

describe("externalHost", () => { 
  test("http://monzo.com != http://google.com", () => {
    const baseUrl = urls.validUrl('http://monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://google.com');
    expect(targetUrl).toBeTruthy();
    const isExternalHost = urls.externalHost(baseUrl!, targetUrl!);
    expect(isExternalHost).toBeTrue();
  });
  
  test("http://some-subdomain.monzo.com != http://some-subdomain.google.com", () => {
    const baseUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://some-subdomain.google.com');
    expect(targetUrl).toBeTruthy();
    const isExternalHost = urls.externalHost(baseUrl!, targetUrl!);
    expect(isExternalHost).toBeTrue();
  });
  
  test("http://monzo.com == http://monzo.com", () => {
    const baseUrl = urls.validUrl('http://monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://monzo.com');
    expect(targetUrl).toBeTruthy();
    const isExternalHost = urls.externalHost(baseUrl!, targetUrl!);
    expect(isExternalHost).toBeFalse();
  });
  
  test("http://some-subdomain.monzo.com == http://some-subdomain.monzo.com", () => {
    const baseUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(baseUrl).toBeTruthy();
    const targetUrl = urls.validUrl('http://some-subdomain.monzo.com');
    expect(targetUrl).toBeTruthy();
    const isExternalHost = urls.externalHost(baseUrl!, targetUrl!);
    expect(isExternalHost).toBeFalse();
  });
});
