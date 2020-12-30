const { BigStockData } = require("./models");
const { network } = require("./network");

(async () => {
    try {
      const { data } = await network.get("/all-symbols");
      const keys = Object.keys(data);
      await BigStockData.destroy({ truncate: true, force: true });
      const new_stocks = await BigStockData.bulkCreate(data);
      console.log(`update ${data.length} stocks`)
    } catch (err) {
      console.log(err);
    }
  })();

  