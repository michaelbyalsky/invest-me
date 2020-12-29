const axios = require("axios");
const Router = require("express").Router();
const { Stock, BigStockData, StockHistory } = require("../../models");
const { Op } = require("sequelize");
const { snakeCase } = require("lodash");
const { network } = require("../../network");

Router.post("/all-data", async (req, res) => {
  try {
    const { data } = await network.get("/all-symbols");
    const keys = Object.keys(req.body);
    await BigStockData.destroy({ truncate: true, force: true });
    const new_stocks = await BigStockData.bulkCreate(req.body);
    res.json({ created: "True" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "error occurred",
    });
  }
});

Router.get("/by-symbol/:symbol", async (req, res) => {
  try {
    const data = await Stock.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "link"],
      },
      where: {
        symbol: req.params.symbol,
      },
    });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/stocks-array", async (req, res) => {
  try {
    const { data } = await network.get("/stocks-list");
    await Stock.destroy({ truncate: true, cascade: false });
    await Stock.bulkCreate(data);
    // await StockHistory.bulkCreate(data);
    return res.json({ updated: true });
  } catch (err) {
    console.log(err);
  }
});

Router.get("/search", async (req, res) => {
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

Router.post("/all", async (req, res) => {
  try {
    const customAttributes = req.body;
    let data;
    if (customAttributes.length > 0) {
      data = await BigStockData.findAll({
        attributes: [
          "id",
          "title",
          "symbol",
          "currentRate",
          ...customAttributes,
        ],
      });
    } else {
      data = await BigStockData.findAll({
        // attributes: {
        //   exclude: ["createdAt", "updatedAt"],
        // },
      });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/top-stocks", async (req, res) => {
  try {
    const { atr } = req.body;
    const data = await BigStockData.findAll({
      limit: 10,
      attributes: ["title", "currentRate", [snakeCase(atr), "period"]],
      order: [[atr, "DESC"]],
    });
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

Router.get("/periods", async (req, res) => {
  try {
    const data = Object.keys(BigStockData.rawAttributes);
    const filtered = data
      .filter(
        (key) =>
          key !== "id" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "title" &&
          key !== "symbol" &&
          key !== "currentRate"
      )
      .map((key) => ({ label: key, value: key }));
    res.json(filtered);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/one-stock-data/:symbol", async (req, res) => {
  try {
    const linkAddress = `https://www.bizportal.co.il/realestates/quote/performance/${req.params.symbol}`;
    try {
      const { data } = await network.get(`/one-stock/?q=${linkAddress}`);
      const updated = await BigStockData.update(data, {
        where: {
          symbol: data.symbol,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      const stock = await BigStockData.findOne({
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "title",
            "symbol",
            "id",
            "currentRate",
            "dayChange",
          ],
        },
        where: {
          symbol: req.params.symbol,
        },
      });
      res.json(stock);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
