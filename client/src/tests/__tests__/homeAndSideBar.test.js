const puppeteer = require("puppeteer");
const nock = require("nock");
const useNock = require("nock-puppeteer");
const { topStocks, periods, usersProfiles } = require("../mocks/homePageMock");
const { headerMock } = require("../mocks/headerMock");

const cookies = [
  {
    name: "accessToken",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoic3V2ZWxvY2l0eSIsImlhdCI6MTYwNDU3MzI5MSwiZXhwIjoxNjA0NTc0MTkxfQ.dhzCg4d2WTaCKlwV4vtN2PDvlipZQ_LGpMPYjSkjrOM",
  },
  {
    name: "refreshToken",
    value:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoic3V2ZWxvY2l0eSIsImlhdCI6MTYwNDU3MzI5MSwiZXhwIjoxNjA0NjU5NjkxfQ.C-88r1p3hTDcvfVSSiK9E0YTnpxviZg4eGEHWeB6an0",
  },
];

jest.setTimeout(15000);

describe("Home page and side bar", () => {
  let page;
  let browser;
  beforeAll(async () => {
    // open a chromium browser
    browser = await puppeteer.launch({
      slowMo: 45,
      headless: false,
    });
    // open a new page within that browser
    page = await browser.newPage();
    useNock(page, ["http://localhost:3000"]);
    await page.goto("http://localhost:3000");
    await page.setCookie(...cookies);
    const screenSize = {
      width: 1280,
      height: 768,
    };
    await page.setViewport(screenSize);
    await nock("http://localhost:3000", { allowUnmocked: true })
      .persist()
      .get("/api/v1/transactions/all-users-profit")
      // .query(() => true)
      .reply(200, usersProfiles);
    await nock("http://localhost:3000", { allowUnmocked: true })
      .persist()
      .post("/api/v1/stocks/top-stocks", {
        atr: "lastThirtyDays",
      })
      // .query(() => true)
      .reply(200, topStocks);
    await nock("http://localhost:3000", { allowUnmocked: true })
      .persist()
      .get("/api/v1/stocks/periods")
      // .query(() => true)
      .reply(200, periods);
    await nock("http://localhost:3000")
      .persist()
      .get("/api/v1/users/info")
      // .query(() => true)
      .reply(200, headerMock);
  });
  afterAll(async () => {
    // close the chromium after each test
    await browser.close();
  });

  test("page has loading while there is no data", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector('[testId="reactLoading"]', { timeOut: 5000 });
  });

  test("Enter home page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector('[testId="topStocks"]', { timeOut: 10000 });
    await page.waitForSelector('[testId="topInvestors"]', { timeOut: 10000 });
    const element = await page.$('[testId="accountMenu"]');
    const text = await page.evaluate((el) => el.textContent, element);
    expect(text.trim()).toEqual(headerMock.username);
    await page.click('[testId="accountMenu"]');
    await page.waitForSelector('[testId="logout"]', { timeOut: 10000 });
    await page.waitForSelector('[testId="myAccount"]', { timeOut: 10000 });
  });

  test("Side bar", async () => {
    await page.goto("http://localhost:3000");
    await page.click('[testId="openSideBar"]');
    await page.click('[testId="allStocks"]');
    expect(page.url().includes("all-stocks")).toEqual(true);
    await page.click('[testId="portfolio"]');
    expect(page.url().includes("portfolio")).toEqual(true);
    await page.click('[testId="competition"]');
    expect(page.url().includes("competition")).toEqual(true);
    await page.click('[testId="calculator"]');
    expect(page.url().includes("calculator")).toEqual(true);
    await page.click('[testId="home"]');
    expect(page.url().includes("calculator")).toEqual(false);
  });
});
