const Router = require("express").Router();
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const { User, RefreshToken } = require("../../models");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

Router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    const validation = loginValidation(req.body);
    if (validation.error) {
      return res.status(400).json(validation.error.details[0].message);
    }
    const count = await User.count({
      where: {
        email: req.body.email,
      },
    });
    if (count === 0) {
      res.status(400).send({ message: "email not exists" });
    }
    const result = await User.findOne({
      attributes: ["id","username", "email", "password"],
      where: {
        email: req.body.email,
      },
      raw: true,
      nest: true,
    });
    const validPass = await bcrypt.compare(req.body.password, result.password);
    if (!validPass) {
      return res.status(400).json({ message: "invalidPassword" });
    } else {
      const token = jwt.sign(
        { id: result.id, username: result.username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.cookie("accessToken", token);
      res.cookie("username", result.username);
      res.cookie("userId", result.id);
      res.header("Authorization", token).json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// authRouter.post('/logout', async (req, res) => {
//     try {
//       // Joi Validation
//       const { error } = tokenValidation(req.body);
//       if (error) {
//         console.error(error.message);
//         return res.status(400).json({ success: false, message: "Don't mess with me" });
//       }
//       const result = await RefreshToken.destroy({
//         where: {
//           token: req.body.token,
//         },
//       });
//       if (!result) return res.status(400).json({ message: 'Refresh Token is required' });
//       res.json({ message: 'User Logged Out Successfully' });
//     } catch (error) {
//       console.error(error.message);
//       res.status(400).json({ message: 'Cannot process request' });
//     }
//   });

Router.post("/register", async (req, res, next) => {
  try {
    const validation = registerValidation(req.body);
    if (validation.error) {
      return res.status(400).send(validation.error.details[0].message);
    }
    const count = await User.count({
      where: {
        email: req.body.email,
      },
    });
    if (count !== 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    //hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const register = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      birthDate: req.body.birthDate,
      password: hashedPassword,
      perrmission: req.body.permission === 'admin' ? 'admin' : 'user'
    });
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = Router;
