const Router = require("express").Router();
const { User, UserMoney } = require("../../models");
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
  const user = await UserStock.findOne({
    where: {
      userId: req.user.userId,
    },
  });
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
    const obj = {
      symbol: req.body.symbol,
      amount: req.body.amount,
      price: req.body.price,
      userId: req.use.userId
    }
    await UserStock.create(obj);
    return res.json({ creatted: true });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
