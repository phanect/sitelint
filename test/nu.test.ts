"use strict";

import SiteGazer from "../src/sitegazer";
import Server from "./server";
import { sortObjects } from "./testutils";

const url = "http://localhost:3456";

let server: Server;

beforeEach(() => {
  server = new Server();
  server.start();
});

afterEach(() => {
  server.close();
});

test("Nu HTML Checker Plugin", async () => {
  const sitegazer = new SiteGazer({
    urls: [ url ],
    sitemap: false,
    crawl: false,
    plugins: [ "nu" ],
  });
  const results = await sitegazer.run();

  expect(sortObjects(results)).toEqual(sortObjects([
    {
      url: "http://localhost:3456",
      pluginName: "Nu HTML Checker",
      line: 3,
      column: 24,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
    },
    // TODO following warnings should not occur when crawl: false.
    // However, since crawl: false is not working for now, SiteGazer crawls and analyze
    // linked pages and warns the error in those pages.
    // ▼▼
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link1",
    },
    {
      column: 11,
      line: 11,
      message: "End tag for  “body” seen, but there were unclosed elements.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 13,
      line: 10,
      message: "Unclosed element “span”.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/link2",
    },
    // ▲▲ Above warnings should not occur when crawl: false.

    // TODO Follwing warning should be removed in the future:
    // http://localhost:3456 and http://localhost:3456/ are both analyzed
    // although they are the same page.
    // @see https://github.com/brendonboshell/supercrawler/pull/37
    {
      column: 24,
      line: 3,
      message: "Consider adding a “lang” attribute to the “html” start tag to declare the language of this document.",
      pluginName: "Nu HTML Checker",
      url: "http://localhost:3456/",
    },
  ]));
}, 20000);
