const { start } = require("./scrapperEvent");
const moment = require("moment");
const app = require("./app");

const endOfDay = moment().endOf("day").valueOf();
const now = moment().valueOf();
const timeOut = endOfDay - now;
const dayInMilliseconds = 1000 * 60 * 60 * 24


const apiPort = process.env.SERVER_PORT || 5000;

app.listen(apiPort, () => {
  console.log(`app listening on port ${apiPort}`);
  setTimeout(() => {
    start();
    setInterval(() => {
      start();
    },process.env.NODE_ENV === 'production' ? dayInMilliseconds : 1000 * 60 * 100);
  }, process.env.NODE_ENV === 'production' ? timeOut : 10000);
});
