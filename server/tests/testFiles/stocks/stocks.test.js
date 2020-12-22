const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../../../app");
const { tradeStocks, initialStocks } = require("../../mocks/transactionsMock");
const allStocksReduced = require("../../mocks/allStocksReduced");
const { mockUser, loginUsers } = require("../../mocks/usersMock");
const bigData = require("../../mocks/bigStockData");
const {
  User,
  UserStock,
  Stock,
  UserMoney,
  BigStockData,
} = require("../../../models");
const userMoney = require("../../mocks/userMoney");

const financial = (x, fixed = 2) => {
  return parseFloat(x).toFixed(fixed);
};

function generateToken(currentUser) {
  const infoForCookie = {
    id: currentUser.id,
    username: currentUser.username,
  };
  return jwt.sign(infoForCookie, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

describe("/stocks", () => {
  beforeAll(async () => {
    await BigStockData.destroy({ truncate: true, force: true });
    await Stock.bulkCreate(bigData);
    await Stock.destroy({ truncate: true, force: true });
    await Stock.bulkCreate(allStocksReduced);
    await UserStock.destroy({ truncate: true, force: true });
    await User.destroy({ truncate: true, force: true });
    await User.bulkCreate(mockUser.slice(0, 2));
    await UserStock.bulkCreate(initialStocks);
    await UserMoney.destroy({ truncate: true, force: true });
    await UserMoney.bulkCreate(userMoney);
  });
  afterAll(async () => {
    // await User.destroy({ truncate: true, force: true });
    await app.close();
  });

  test("can search for stocks by typing", async (done) => {
    const searchStocks = await request(app)
      .get(
        `/api/v1/stocks/search?q=${encodeURI(
          allStocksReduced[0].title.slice(0, 1)
        )}`
      )
      .set("authorization", `bearer ${generateToken(loginUsers[0])}`);
    expect(searchStocks.status).toBe(200);
    const stocks = searchStocks.body;
    expect(stocks.length).toBe(10);
    stocks.forEach((stock) => {
      expect(stock.title.includes(allStocksReduced[0].title.slice(0, 1))).toBe(
        true
      );
    });
    done();
  });

  //   test("can insert all stocks big data", async (done) => {
  //     const createdStocks = await request(app)
  //       .post(
  //         `/api/v1/stocks/all-data`
  //       )
  //       .set("authorization", `bearer ${generateToken(loginUsers[0])}`)
  //     .send(bigData)
  //       expect(createdStocks.status).toBe(200);
  //       const dataFromDb = await BigStockData.count({})
  //       expect(dataFromDb).toBe(bigData.length)
  //     done();
  //   });
});
