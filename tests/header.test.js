const Page = require("./helpers/page");

let page;

describe("Header", () => {
  beforeEach(async () => {
    page = await Page.build();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await page.close();
  });

  it("should ensure that the header has correct text", async () => {
    const text = await page.getContentsOf("a.brand-logo");
    expect(text).toBe("Blogster");
  });

  it("should start oauth flow on clicking login", async () => {
    await page.click(".right a");
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
  });

  it("should show a logout button on successful log in", async () => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toEqual("Logout");
  });
});
