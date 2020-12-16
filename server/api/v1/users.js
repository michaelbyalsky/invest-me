const Router = require("express").Router();
const { User, UserMoney, UserStock, Stock } = require("../../models");
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

Router.get("/money", async (req, res) => {
  try {
    const user = await UserMoney.findOne({
      where: {
        id: req.user.id,
      },
    });
    res.json(user);
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

Router.get("/stocks", async (req, res) => {
  try {
    const user = await UserStock.sequelize.query(
      `SELECT stocks.last_rate as lastRate, stocks.title, stocks.title as title, 
    user_stocks.symbol as symbol, user_stocks.user_id as userId,
    sum(user_stocks.buy_amount * user_stocks.buy_price) - sum(user_stocks.sell_amount* user_stocks.sell_price) as currentPrice, 
    SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount) as currentAmount,
    (sum(user_stocks.buy_amount * user_stocks.buy_price) - sum(user_stocks.sell_amount * user_stocks.sell_price)) / 
    (SUM(user_stocks.buy_amount) - sum(user_stocks.sell_amount)) as avgPrice 
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
      change: (obj["lastRate"] / obj.avgPrice) * 100 - 100,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
  }
});

// Router.get("/stocks", async (req, res) => {
//   try {
//     const user = await UserStock.findAll({
//       where: {
//         userId: req.user.id,
//       },
//       include: {
//         model: Stock,
//         attributes: ["title", "lastRate"],
//       },
//       attributes: [
//         "symbol",
//         "userId",
//         [
//           sequelize.fn(
//             "SUM",
//             sequelize.where(
//               sequelize.col("price"),
//               "*",
//               sequelize.col("amount")
//             )
//           ),
//           "totalCost",
//         ],
//         [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
//       ],
//       group: ["symbol"],
//       order: [
//         [sequelize.fn("SUM", sequelize.col("totalCost")), "DESC"],
//         // [sequelize.fn("AVG", sequelize.col("avgPrice")), "DESC"],
//       ],
//       raw: true,
//     });
//     const addAvgPrice = user.map((obj) => ({
//       ...obj,
//       avgPrice: obj.totalCost / obj.totalAmount,
//     }));
//     const maped = addAvgPrice.map((obj) => ({
//       ...obj,
//       change: (obj["Stock.lastRate"] / obj.avgPrice) * 100 - 100,
//     }));
//     const filtered = maped.filter((stock) => stock.totalAmount > 0);
//     res.json(filtered);
//   } catch (err) {
//     console.error(err);
//   }
// });

Router.patch("/money", async (req, res) => {
  try {
    const hasPotfolio = await UserMoney.count({
      where: {
        username: req.user.id,
      },
    });
    if (hasPotfolio === 0) {
      await UserMoney.create(req.body);
      return res.json({ creatted: true });
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

Router.post("/stocks", async (req, res) => {
  console.log(req.body);
  try {
    const obj = {
      symbol: Number(req.body.symbol),
      buy_price: req.body.price,
      buy_amount: req.body.amount,
      userId: req.user.id,
    };
    await UserStock.create(obj);
    await UserMoney.decrement(
      { cash: (obj.buy_price * obj.buy_amount) / 100 },
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
Router.patch("/stocks", async (req, res) => {
  try {
    console.log(req.body);
    const obj = {
      userId: req.user.id,
      symbol: req.body.symbol,
      sell_price: req.body.price,
      sell_amount: req.body.amount,
      operation: "sell",
    };
    console.log(obj);
    await UserStock.create(obj);
    const stock = await Stock.findOne({
      attributes: ["lastRate"],
      where: {
        symbol: req.body.symbol,
      },
    });
    // 0.25 tax fee
    console.log(obj.amount);
    await UserMoney.increment(
      {
        cash: !req.body.negative
          ? ((req.body.amount * stock.lastRate) / 100) * 0.75
          : (req.body.amount * stock.lastRate) / 100,
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
