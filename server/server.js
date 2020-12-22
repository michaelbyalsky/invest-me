const { BigStockData } = require("./models");
const axios = require("axios");

const updateData = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/all-symbols");
    const keys = Object.keys(data);
    console.log(data.length);
    await BigStockData.destroy({ truncate: true, force: true });
    const new_stocks = await BigStockData.bulkCreate(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "error occurred",
    });
  }
};

const app = require("./app");

apiPort = 5000;

app.listen(apiPort, () => {
  console.log(`app listening on port ${apiPort}`);
  updateData();
  //   setInterval(() => {
  //       updateData();
  //   }, 3600 * 1000);
});
