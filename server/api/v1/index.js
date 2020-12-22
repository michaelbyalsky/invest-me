const v1Router = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../../middelware/checkToken"); 
require("dotenv").config()

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

v1Router.use("/auth", require("./auth"));
v1Router.use("/stocks",verifyToken, require("./stocks"));
v1Router.use("/transactions",verifyToken, require("./transactions"));
v1Router.use("/users",verifyToken, require("./users"));

v1Router.use(unknownEndpoint);

module.exports = v1Router;
