const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../../../app");
const { tradeStocks, initialStocks } = require("../../mocks/transactionsMock");
const allStocksReduced = require("../../mocks/allStocksReduced");
const { mockUser, loginUsers } = require("../../mocks/usersMock");
const { User, UserStock, Stock, UserMoney } = require("../../../models");
const userMoney = require("../../mocks/userMoney");

function generateToken(currentUser) {
  const infoForCookie = {
    id: currentUser.id,
    username: currentUser.username,
  };
  return jwt.sign(infoForCookie, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

const financial = (x, fixed=2) => {
  return parseFloat(x).toFixed(fixed);
};

describe("testing transactions endpoints", () => {
  beforeAll(async () => {
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

  test("can get users profit and order them", async (done) => {
    const allTransactions = await request(app)
      .get("/api/v1/transactions/all-users-profit")
      .set("authorization", `bearer ${generateToken(loginUsers[0])}`);
    expect(allTransactions.status).toBe(200);
    expect(allTransactions.body.length).toBe(2);
    expect(allTransactions.body[1].username).toBe(mockUser[0].username);
    expect(allTransactions.body[0].username).toBe(mockUser[1].username);
    expect(financial(allTransactions.body[0].totalProfit)).toBe("0.16");
    expect(financial(allTransactions.body[0].change)).toBe("0.83");
    done();
  });

  test("can get user profit and portfolio, and increase and decrease value", async (done) => {
    const profit = await request(app)
      .get("/api/v1/transactions/user-profit")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`);
    expect(profit.status).toBe(200);

    expect(profit.body[0].username).toBe(mockUser[0].username);
    const allStocks = await request(app)
      .get("/api/v1/transactions")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`);
    expect(allStocks.status).toBe(200);
    expect(allStocks.body.length).toBe(2);
    expect(
      financial(
        allStocks.body[0].profitInShekels + allStocks.body[1].profitInShekels
      )
    ).toBe(financial(profit.body[0].totalProfit));
    done();
  });

  test("can buy and sell stock", async (done) => {
    const moneyBeforeBuy = await UserMoney.findOne({
      where: {
        userId: mockUser[0].id,
      },
    });

    const profitAfterBuy = await request(app)
      .post("/api/v1/transactions")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`)
      .send(initialStocks[0]);

    expect(profitAfterBuy.status).toBe(200);
    const moneyAfterBuy = await UserMoney.findOne({
      where: {
        userId: mockUser[0].id,
      },
    });
    expect(
      financial(
        moneyBeforeBuy.cash -
          (initialStocks[0].buyAmount * initialStocks[0].buyPrice) / 100
      )
    ).toBe(financial(moneyAfterBuy.cash));
    const allUserStocksAfterBuy = await request(app)
      .get("/api/v1/transactions")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`);
    expect(allUserStocksAfterBuy.status).toBe(200);
    expect(allUserStocksAfterBuy.body.length).toBe(2);
    expect(allUserStocksAfterBuy.body[0].currentAmount).toBe(4);
    const profitAfterSell = await request(app)
      .patch("/api/v1/transactions")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`)
      .send(initialStocks[2]);
    expect(profitAfterSell.status).toBe(200);
    const allUserStocksAfterSell = await request(app)
      .get("/api/v1/transactions")
      .set("authorization", `bearer ${generateToken(mockUser[0])}`);
    expect(allUserStocksAfterSell.status).toBe(200);
    expect(allUserStocksAfterSell.body.length).toBe(2);
    expect(allUserStocksAfterSell.body[0].currentAmount).toBe(3);

    const moneyAfterSell = await UserMoney.findOne({
      where: {
        userId: mockUser[0].id,
      },
    });
    expect(
      financial(
        moneyAfterBuy.cash +
          (financial(initialStocks[2].sellAmount * initialStocks[2].sellPrice)) / 100 * 0.75
      , 1)
    ).toBe(financial(moneyAfterSell.cash, 1));
    done();
  });
});
