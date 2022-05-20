const express = require('express');
const launchesRouter = require('./routes/launches/launches.router');
const planetRouter = require('./routes/planets/planets.router');

const api = express.Router(); 
api.use('/planets', planetRouter);
api.use('/launches', launchesRouter);

module.exports = api;