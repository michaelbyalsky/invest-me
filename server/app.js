const express = require("express");
const app = express();
const path = require('path');
var cors = require('cors')


app.use(cors())
app.use(express.json({ limit: '50mb' }));

app.use(require("./middelware/morgan"));

app.use("/api", require("./api"));

app.use(express.static(path.join(__dirname, '.', 'build')));

module.exports = app;
