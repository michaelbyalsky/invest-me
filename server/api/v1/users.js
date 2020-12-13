const Router = require("express").Router();
const { User, UserMoney, UserStock, Stock } = require("../../models");
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");

Router.get("/money", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.user.username,
    },
    include: {
      model: UserMoney,
    },
  });
});



Router.get("/stocks", async (req, res) => {
  try {
    const user = await UserStock.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: Stock,
        attributes: ["title", "lastRate"]
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
      group: ['symbol'],
      order: [
        [sequelize.fn("SUM", sequelize.col("totalCost")), "DESC"],
        // [sequelize.fn("AVG", sequelize.col("avgPrice")), "DESC"],
      ],
      raw: true,
    });
    const addAvgPrice = user.map((obj) => ({...obj, avgPrice: obj.totalCost / obj.totalAmount}))
    const maped = addAvgPrice.map((obj) => ({...obj, change: obj["Stock.lastRate"] /  obj.avgPrice * 100 - 100}))
    res.json(maped);
  } catch (err) {
    console.error(err);
  }
});

Router.patch("/money", async (req, res) => {
  try {
    const hasPotfolio = await User.count({
      where: {
        username: req.user.username,
      },
      include: {
        model: UserMoney,
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
    console.log(req.body);
  
    await UserStock.create({ 
      userId: req.user.id,
      symbol: Number(req.body.symbol),
      price: req.body.price,
      amount: req.body.amount,
    });
    return res.json({ creatted: true });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
