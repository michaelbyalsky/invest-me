const axios = require("axios");

const network = axios.create({
  baseURL: `http://${process.env.SCRAPPER_HOST}:${process.env.SCRAPPER_PORT}`,
});

module.exports.network = network;
