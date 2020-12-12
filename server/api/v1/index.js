const v1Router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config()

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

v1Router.use("/auth", require("./auth"));
v1Router.use("/stocks",verifyToken, require("./stocks"));
v1Router.use("/users",verifyToken, require("./users"));

v1Router.use(unknownEndpoint);

module.exports = v1Router;
