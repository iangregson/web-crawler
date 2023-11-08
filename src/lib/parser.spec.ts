import { describe, expect, test } from "bun:test";
import { parser } from './parser';

const emptyHtml = "";
const indexHtml = await Bun.file(import.meta.dir + '/../test-fixtures/html/index.html').text();
const blogHtml = await Bun.file(import.meta.dir + '/../test-fixtures/html/blog/index.html').text();
const invalidHtml = `
I am not HTML.
I have no tags.

** Maybe I'm Markdown? **
`;

describe('parseLinks', () => {
  test('invalid HTML', () => {
    const links = parser.parseLinks(invalidHtml, new URL('http://localhost:80'));
    expect(links).toBeArrayOfSize(0);
  });
  
  test('empty HTML', () => {
    const links = parser.parseLinks(emptyHtml, new URL('http://localhost:80'));
    expect(links).toBeArrayOfSize(0);
  });
  
  test('index.html', () => {
    const links = parser.parseLinks(indexHtml, new URL('http://localhost:80'));
    expect(links).toBeArrayOfSize(11);
  });
  
  test('blog.html', () => {
    const links = parser.parseLinks(blogHtml, new URL('http://localhost:80'));
    expect(links).toBeArrayOfSize(5);
  });
});