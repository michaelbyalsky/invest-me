const axios = require("axios");
const Router = require("express").Router();
const {
  Stock,
  BigStockData,
  StockHistory,
} = require("../../models");
const { Op } = require("sequelize");

Router.post("/all-data", async (req, res) => {
  try {
    //  const { data } = await axios.get('http://localhost:8000/all-symbols')
    const new_stocks = await BigStockData.bulkCreate(req.body);
    return res.json({ created: "True" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "error occured",
    });
  }
});

Router.get("/stocks-array", async (req, res) => {
  try {
    const { data } = await axios.get("http://localhost:8000/stocks-list");
    await Stock.destroy({ truncate: true, cascade: false });
    await Stock.bulkCreate(data);
    await StockHistory.bulkCreate(data);
    return res.json({ updated: true });
  } catch (err) {
    console.log(err);
  }
});

Router.get("/search", async (req, res) => {
  console.log(req.query.q);
  try {
    const data = await Stock.findAll({
      limit: 10,
      where: {
        title: {
          [Op.like]: "%" + req.query.q + "%",
        },
      },
    });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/all", async (req, res) => {
  try {
    const data = await BigStockData.findAll();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/all-regular", async (req, res) => {
  try {
    const data = await Stock.findAll();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});


module.exports = Router;
