const { start } = require("./scrapperEvent");
const moment = require("moment");

const endOfDay = moment().endOf("day").valueOf();
const now = moment().valueOf();
const timeOut = endOfDay - now;
const dayInMilliseconds = 1000 * 60 * 60 * 24

const app = require("./app");

const apiPort = process.env.SERVER_PORT || 5000;

app.listen(apiPort, () => {
  console.log(`app listening on port ${apiPort}`);
  setTimeout(() => {
    start();
    setInterval(() => {
      start();
    }, dayInMilliseconds);
  }, timeOut);
});
