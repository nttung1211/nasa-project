const BadRequestError = require('../../errors/BadRequestError');
const {
  getAllLaunches,
  createLaunch,
  findLaunch,
  deleteLaunch,
  updateLaunch,
  abortLaunch,
} = require('../../models/launches.model');

const httpGetLaunches = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    res.status(200).json(await getAllLaunches(page, limit));
  } catch (error) {
    next(error);
  }
};

const httpCreateLaunch = async (req, res, next) => {
  try {
    const { mission, rocket, launchDate: launchDateStr, target } = req.body;

    if (!mission || !rocket || !launchDateStr || !target) {
      throw new BadRequestError('Missing required fields');
    }

    const launchDate = new Date(launchDateStr);

    if (isNaN(launchDate)) {
      throw new BadRequestError('Invalid launch date');
    }

    const launch = {
      mission,
      rocket,
      launchDate: new Date(launchDate),
      target,
    };
    res.status(201).json(await createLaunch(launch));
  } catch (error) {
    next(error);
  }
};

const httpGetOneLaunch = async (req, res, next) => {
  try {
    res.status(200).json(await findLaunch(+req.params.flightNumber));
  } catch (error) {
    next(error);
  }
};

const httpAbortLaunch = async (req, res, next) => {
  try {
    res.status(200).json(await abortLaunch(+req.params.flightNumber));
  } catch (error) {
    next(error);
  }
};

const httpDeleteLaunch = (req, res, next) => {
  try {
    res.status(200).json(deleteLaunch(+req.params.flightNumber));
  } catch (error) {
    next(error);
  }
};

const httpUpdateLaunch = async (req, res, next) => {
  try {
    const flightNumber = +req.params.flightNumber;

    const { launchDate: launchDateStr } = req.body;
    if (launchDateStr) {
      const launchDate = new Date(launchDateStr);
      if (isNaN(launchDate)) {
        throw new BadRequestError('Invalid launch date');
      }
    }

    const { _id, __v, ...launch } = req.body;
    const updatedLaunch = await updateLaunch({
      ...launch,
      flightNumber,
    });

    res.status(200).json(updatedLaunch);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  httpGetAllLaunches: httpGetLaunches,
  httpCreateLaunch,
  httpUpdateLaunch,
  httpDeleteLaunch,
  httpGetOneLaunch,
  httpAbortLaunch,
};
