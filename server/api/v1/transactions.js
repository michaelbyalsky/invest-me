const Router = require("express").Router();
const { User, UserMoney, UserStock, Stock } = require("../../models");
const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

Router.get("/money", async (req, res) => {
  try {
    const userMoney = await UserMoney.findOne({
      where: {
        id: req.user.id,
      },
    });
    res.json(userMoney);
  } catch (err) {
    res.json(err.message);
  }
});

Router.get("/trades", async (req, res) => {
  try {
    const userMoney = await userStock.findOne({
      where: {
        id: req.user.id,
      },
    });
    res.json(userMoney);
  } catch (err) {
    res.json(err.message);
  }
});

Router.get("/investments", async (req, res) => {
  try {
    const user = await UserStock.sequelize.query(
      `SELECT user_id as userId,
      sum(buy_amount * buy_price) - sum(sell_amount * sell_price) as currentPrice 
      FROM user_stocks
      where user_id = '${req.user.id}'
      GROUP BY user_id      
        `,
      { type: QueryTypes.SELECT }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
  }
});

Router.get("/all-users-profit", async (req, res) => {
  try {
    const user = await UserStock.sequelize.query(
      `SELECT users.username, user_stocks.user_id as userId,
      SUM(stocks.last_rate  * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalCurrentPrice,
      SUM(((user_stocks.buy_amount * user_stocks.buy_price) - (user_stocks.sell_amount * user_stocks.sell_price)) / 
      ((user_stocks.buy_amount) - (user_stocks.sell_amount)) * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalBuyingPrice,
      SUM(stocks.last_rate  * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) -  SUM(((user_stocks.buy_amount * user_stocks.buy_price) - (user_stocks.sell_amount * user_stocks.sell_price)) / 
      ((user_stocks.buy_amount) - (user_stocks.sell_amount)) * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalProfit
      FROM user_stocks
      JOIN stocks on stocks.symbol = user_stocks.symbol
      JOIN users on users.id = user_stocks.user_id
      GROUP by user_stocks.user_id
      `,
      { type: QueryTypes.SELECT }
    );

    user.forEach((stock) => {
      stock.totalBuyingPrice = Number(stock.totalBuyingPrice);
      stock.userId = Number(stock.userId);
      stock.totalCurrentPrice = Number(stock.totalCurrentPrice);
      stock.totalProfit = Number(stock.totalProfit);
    });
    const mapped = user
      .map((obj) => ({
        ...obj,
        change: (obj.totalCurrentPrice / obj.totalBuyingPrice) * 100 - 100,
      }))
      .sort((a, b) => b.change - a.change);
    res.json(mapped);
  } catch (err) {
    console.error(err);
  }
});

Router.get("/user-profit", async (req, res) => {
  try {
    const user = await UserStock.sequelize.query(
      `SELECT users.username, user_stocks.user_id as userId,
      SUM(stocks.last_rate  * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalCurrentPrice,
      SUM(((user_stocks.buy_amount * user_stocks.buy_price) - (user_stocks.sell_amount * user_stocks.sell_price)) / 
      ((user_stocks.buy_amount) - (user_stocks.sell_amount)) * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalBuyingPrice,
      SUM(stocks.last_rate  * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) -  SUM(((user_stocks.buy_amount * user_stocks.buy_price) - (user_stocks.sell_amount * user_stocks.sell_price)) / 
      ((user_stocks.buy_amount) - (user_stocks.sell_amount)) * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as totalProfit
      FROM user_stocks
      JOIN stocks on stocks.symbol = user_stocks.symbol
      JOIN users on users.id = user_stocks.user_id
      WHERE user_id = '${req.user.id}'
      GROUP by user_stocks.user_id
      `,
      { type: QueryTypes.SELECT }
    );
    user.forEach((stock) => {
      stock.totalBuyingPrice = Number(stock.totalBuyingPrice);
      stock.userId = Number(stock.userId);
      stock.totalCurrentPrice = Number(stock.totalCurrentPrice);
    });
    const mapped = user.map((obj) => ({
      ...obj,
      change: (obj.totalCurrentPrice / obj.totalBuyingPrice) * 100 - 100,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
  }
});

Router.get("/", async (req, res) => {
  try {
    const user = await UserStock.sequelize.query(
      `SELECT stocks.title as title, stocks.last_rate as lastRate, 
      user_stocks.symbol as symbol, user_stocks.user_id as userId,
      stocks.last_rate  * (SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount)) as currentPrice, 
      SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount) as currentAmount,
      (sum(user_stocks.buy_amount * user_stocks.buy_price) - sum(user_stocks.sell_amount * user_stocks.sell_price)) / 
      (SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount)) as avgPrice,
      (sum(user_stocks.buy_amount * user_stocks.buy_price) - sum(user_stocks.sell_amount * user_stocks.sell_price)) / 
      (SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount)) * (SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount)) as buyingPrice
      FROM user_stocks
      JOIN stocks on stocks.symbol = user_stocks.symbol
      where user_id = '${req.user.id}'
      GROUP by user_stocks.symbol, user_stocks.user_id
    `,
      { type: QueryTypes.SELECT }
    );

    user.forEach((stock) => {
      stock.currentAmount = Number(stock.currentAmount);
      stock.userId = Number(stock.userId);
    });
    const mapped = user.map((obj) => ({
      ...obj,
      change: (obj.lastRate / obj.avgPrice) * 100 - 100,
      profitInShekels: (obj.currentPrice - obj.buyingPrice) / 100,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
  }
});

Router.patch("/money", async (req, res) => {
  try {
    const hasPortfolio = await UserMoney.count({
      where: {
        username: req.user.id,
      },
    });
    if (hasPortfolio === 0) {
      await UserMoney.create(req.body);
      return res.json({ created: true });
    } else {
      const { cash, investments } = req.body;
      await UserMoney.update(
        { cash: cash, investments: investments },
        {
          where: req.user.username,
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

Router.post("/", async (req, res) => {
  try {
    const obj = {
      symbol: Number(req.body.symbol),
      buyPrice: req.body.buyPrice,
      buyAmount: req.body.buyAmount,
      userId: req.user.id,
    };
    await UserStock.create(obj);
    const money = await UserMoney.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!money || money.cash < (obj.buyPrice * obj.buyAmount) / 100) {
      return res
        .status(400)
        .json({ message: "you don't have enough money for this deal" });
    }
    await UserMoney.decrement(
      { cash: (obj.buyPrice * obj.buyAmount) / 100 },
      {
        where: { userId: req.user.id },
      }
    );

    return res.json({ created: true });
  } catch (err) {
    console.log(err);
  }
});

//sell stocks
Router.patch("/", async (req, res) => {
  try {
    const obj = {
      userId: req.user.id,
      symbol: req.body.symbol,
      sellPrice: req.body.sellPrice,
      sellAmount: req.body.sellAmount,
      operation: "sell",
    };
    await UserStock.create(obj);

    // 0.25 tax fee
    await UserMoney.increment(
      {
        cash: !req.body.negative
          ? ((req.body.sellAmount * obj.sellPrice) / 100) * 0.75
          : (req.body.sellAmount * obj.sellPrice) / 100,
      },
      {
        where: { userId: req.user.id },
      }
    );

    return res.json({ created: true });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
