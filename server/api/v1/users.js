const Router = require("express").Router();
const { User, UserMoney, UserStock, Stock } = require("../../models");
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");

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
    const user = await UserStock.findAll({
      where: {
        userId: req.user.id,
      },
      attributes: [
        "userId",
        [
          sequelize.fn(
            "SUM",
            sequelize.where(
              sequelize.col("price"),
              "*",
              sequelize.col("amount")
            )
          ),
          "totalCost",
        ],
      ],
      group: ["userId"],
      order: [
        [sequelize.fn("SUM", sequelize.col("totalCost")), "DESC"],
        // [sequelize.fn("AVG", sequelize.col("avgPrice")), "DESC"],
      ],
      raw: true,
    });
    res.json(user);
  } catch (err) {
    console.error(err);
  }
});

Router.get("/stocks", async (req, res) => {
  try {
    const user = await UserStock.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: Stock,
        attributes: ["title", "lastRate"],
      },
      attributes: [
        "symbol",
        "userId",
        [
          sequelize.fn(
            "SUM",
            sequelize.where(
              sequelize.col("price"),
              "*",
              sequelize.col("amount")
            )
          ),
          "totalCost",
        ],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["symbol"],
      order: [
        [sequelize.fn("SUM", sequelize.col("totalCost")), "DESC"],
        // [sequelize.fn("AVG", sequelize.col("avgPrice")), "DESC"],
      ],
      raw: true,
    });
    const addAvgPrice = user.map((obj) => ({
      ...obj,
      avgPrice: obj.totalCost / obj.totalAmount,
    }));
    const maped = addAvgPrice.map((obj) => ({
      ...obj,
      change: (obj["Stock.lastRate"] / obj.avgPrice) * 100 - 100,
    }));
    const filtered = maped.filter((stock) => stock.totalAmount > 0);
    res.json(filtered);
  } catch (err) {
    console.error(err);
  }
});

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
  try {
    const obj = {
      symbol: Number(req.body.symbol),
      price: req.body.price,
      amount: req.body.amount,
      userId: req.user.id,
    };
    await UserStock.create(obj);
    await UserMoney.decrement(
      { cash: (obj.price * obj.amount) / 100 },
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
      price: req.body.price,
      amount: -req.body.amount,
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
        cash: !req.body.negetive
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
