const Router = require("express").Router();
const { User, UserMoney } = require("../../models");

Router.get("/info", async (req, res) => {
  try {
    const user = await User.findOne({
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
    res.json(user);
  } catch (err) {
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
