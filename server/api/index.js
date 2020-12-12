const api = require('express').Router();

api.use('/v1', require('./v1'));

module.exports = api;
