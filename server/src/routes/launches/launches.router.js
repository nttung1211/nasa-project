const express = require('express');

const {
  httpGetAllLaunches,
  httpCreateLaunch,
  httpUpdateLaunch,
  httpDeleteLaunch,
  httpGetOneLaunch,
  httpAbortLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpCreateLaunch);
launchesRouter.put('/:flightNumber', httpUpdateLaunch);
launchesRouter.delete('/:flightNumber', httpAbortLaunch);
launchesRouter.get('/:flightNumber', httpGetOneLaunch);

module.exports = launchesRouter;
