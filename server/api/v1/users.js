const Router = require("express").Router();
const { User, UserMoney, UserStock } = require("../../models");
const { QueryTypes } = require("sequelize");

Router.get("/info", async (req, res) => {
  try {
    const userInfo = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password", "id"],
      },
      include: {
        model: UserMoney,
        attributes: ["cash"],
      },
      raw: true,
    });
    const userInvestments = await UserStock.sequelize.query(
      `SELECT user_id as userId,
      SUM(stocks.last_rate  * ((user_stocks.buy_amount) - (user_stocks.sell_amount)) / 100) as currentPrice 
      FROM user_stocks
      JOIN stocks on stocks.symbol = user_stocks.symbol
      where user_id = '${req.user.id}'
      GROUP BY userId      
        `,
      { type: QueryTypes.SELECT }
    );
    userInfo.cash = userInfo["UserMoney.cash"];
    delete userInfo["UserMoney.cash"];
    const user = { ...userInfo, investments: userInvestments[0] ? userInvestments[0].currentPrice : 0 };
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/update-cash", async (req, res) => {
  try {
    const { cash } = req.body;
    const ifCashExists = await UserMoney.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!ifCashExists) {
      await UserMoney.create({ cash: cash, userId: req.user.id });
    } else {
      await UserMoney.update(
        { cash: cash },
        {
          where: {
            userId: req.user.id,
          },
        }
      );
    }
    res.json({ updated: "true" });
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
});

Router.post("/info", async (req, res) => {
  try {
    const { firstName, lastName, username, birthDate } = req.body;
    const { cash } = req.body;
    await User.update(
      {
        firstName: firstName,
        lastName: lastName,
        username: username,
        birthDate: birthDate,
      },
      {
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ["password", "id"],
        },
        include: {
          model: UserMoney,
          attributes: ["cash"],
        },
        raw: true,
      }
    );
    await UserMoney.update(
      { cash: cash },
      {
        where: {
          userId: req.user.id,
        },
      }
    );
    res.json({ message: "updated" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
