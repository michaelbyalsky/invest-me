const { BigStockData } = require("./models");
const axios = require("axios");

(async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/all-symbols");
      const keys = Object.keys(data);
      await BigStockData.destroy({ truncate: true, force: true });
      const new_stocks = await BigStockData.bulkCreate(data);
      console.log(`update ${data.length} stocks`)
    } catch (err) {
      console.log(err);
    }
  })();

  