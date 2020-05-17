const Page = require("./helpers/page");

let page;

describe("Blogs", () => {
  beforeEach(async () => {
    page = await Page.build();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await page.close();
  });

  describe("When logged in", () => {
    beforeEach(async () => {
      await page.login();
      await page.click("a.btn-floating");
    });

    it("should show blog create form", async () => {
      const label = await page.getContentsOf("form label");
      expect(label).toEqual("Blog Title");
    });

    describe("Using invalid inputs", () => {
      beforeEach(async () => {
        await page.click("form button");
      });

      it("should show an error message", async () => {
        const titleError = await page.getContentsOf(".title .red-text");
        expect(titleError).toEqual("You must provide a value");
        const contentError = await page.getContentsOf(".content .red-text");
        expect(contentError).toEqual("You must provide a value");
      });
    });

    describe("Using valid inputs", () => {
      beforeEach(async () => {
        await page.type(".title input", "Blog Title");
        await page.type(".content input", "Blog Content");

        await page.click("form button");
      });

      it("should take user to review screen", async () => {
        const text = await page.getContentsOf("h5");
        expect(text).toEqual("Please confirm your entries");
      });

      it("should save blog to index page when submitted", async () => {
        await page.click("button.green");
        await page.waitFor(".card");
        const title = await page.getContentsOf(".card-title");
        const content = await page.getContentsOf("p");
        expect(title).toEqual("Blog Title");
        expect(content).toEqual("Blog Content");
      });
    });
  });

  describe("When not logged in", () => {
    it("should not create a blog post", async () => {
      const result = await page.evaluate(() => {
        return fetch("/api/blogs", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "My Title",
            content: "My Content",
          }),
        }).then((res) => res.json());
      });
      expect(result).toEqual({ error: "You must log in!" });
    });

    it("should not view blog posts", async () => {
      const result = await page.evaluate(() => {
        return fetch("/api/blogs", {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
      });
      expect(result).toEqual({ error: "You must log in!" });
    });
  });
});
