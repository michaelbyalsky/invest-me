const Router = require("express").Router();
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const { User, RefreshToken, UserMoney } = require("../../models");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../middelware/checkToken");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

// safe logout- destroy refresh token
Router.post("/logout", async (req, res) => {
  try {
    const result = await RefreshToken.destroy({
      where: {
        token: req.body.token,
      },
    });
    if (!result)
      return res.status(400).json({ message: "Refresh Token is required" });
    res.json({ message: "User Logged Out Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Cannot process request" });
  }
});

Router.get("/validate-token", verifyToken, (req, res) => {
  res.json({ valid: true });
});

// generate new access token
Router.post("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    const validRefreshToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
      },
    });
    if (!validRefreshToken)
      return res.status(403).json({ message: "Invalid Refresh Token" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          console.error(error.message);
          return res.status(403).json({ message: "Invalid Refresh Token" });
        }
        delete decoded.iat;
        delete decoded.exp;
        const token = generateToken(decoded);
        res.cookie("accessToken", token);
        res.json({ message: "token updated" });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Cannot process request" });
  }
});

// login and generate new access token
Router.post("/login", async (req, res, next) => {
  try {
    const validation = loginValidation(req.body);
    if (validation.error) {
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    }
    const count = await User.count({
      where: {
        email: req.body.email,
      },
    });
    if (count === 0) {
      return res.status(403).send({ message: "email not exists" });
    }
    const result = await User.findOne({
      attributes: ["id", "username", "email", "password"],
      where: {
        email: req.body.email,
      },
      raw: true,
      nest: true,
    });
    const validPass = await bcrypt.compare(req.body.password, result.password);
    if (!validPass) {
      return res.status(403).json({ message: "invalidPassword" });
    } else {
      const infoForToken = { id: result.id, username: result.username };
      const token = generateToken(infoForToken);
      const refreshToken = jwt.sign(
        { id: result.id, username: result.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: req.body.rememberMe ? "365d" : "1d" }
      );
      const isTokenExist = await RefreshToken.findOne({
        where: {
          username: result.username,
        },
      });

      if (!isTokenExist) {
        await RefreshToken.create({
          username: result.username,
          token: refreshToken,
        });
      } else {
        await RefreshToken.update(
          { token: refreshToken },
          {
            where: {
              username: result.username,
            },
          }
        );
      }

      res.cookie("accessToken", token);
      res.cookie("refreshToken", refreshToken);
      res.cookie("username", result.username);
      res.cookie("userId", result.id);
      res.header("Authorization", token).json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// register user
Router.post("/register", async (req, res, next) => {
  try {
    const validation = registerValidation(req.body);
    if (validation.error) {
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    }
    const countEmail = await User.count({
      where: {
        email: req.body.email,
      },
    });
    if (countEmail !== 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    const countUsername = await User.count({
      where: {
        username: req.body.username,
      },
    });
    if (countUsername !== 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    //hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      birthDate: req.body.birthDate,
      password: hashedPassword,
      permission: req.body.permission === "admin" ? "admin" : "user",
    });
    const user = await User.findOne({
      attributes: ["id"],
      where: {
        username: req.body.username,
      },
    });
    await UserMoney.create({ userId: user.id, cash: 0 });
    // await UserMoney.create
    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = Router;
