const axios = require('axios');

const CONFIG = require('../../constants/config');
const DEFAULT = require('../../constants/defaultValues');
const NotFoundError = require('../errors/NotFoundError');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const loadXSpaceLaunches = async () => {
  const response = await axios.post(CONFIG.XSpaceLaunchesUrl, {
    query: {},
    options: {
      // limit: 5,
      // page: 3,
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.error('problem with loading XSpace launches');
  }

  response.data.docs.forEach((launch) => {
    saveLaunch({
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.date_local,
      customers: launch.payloads.flatMap((p) => p.customers),
      upcoming: launch.upcoming,
      success: launch.success,
    });
  });
};

const getLaunches = async (page = 1, limit = DEFAULT.launchesPerPage) => {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ flightNumber: 1 })
    .exec();
};
// why exec(): https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do

const createLaunch = async (launch) => {
  const flightNumber = await genFlightNumber();
  const newLaunch = {
    ...launch,
    flightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  };
  return await saveLaunch(newLaunch);
};

const saveLaunch = async (launch) => {
  if (launch.target && !planets.findOne({ name: launch.target }).exec()) {
    throw new NotFoundError(`Planet ${launch.target} not found`);
  }
  const savedLaunch = await launches
    .findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
        new: true,
      }
    )
    .exec();
  return savedLaunch;
};

const findLaunch = async (flightNumber) => {
  const launch = await launches.findOne({ flightNumber }).exec();
  if (!launch) {
    throw new NotFoundError(`Launch with the flightNumber: ${flightNumber} not found`);
  }
  return launch;
};

const updateLaunch = async (launch) => {
  await findLaunch(launch.flightNumber);
  return await saveLaunch(launch);
};

const deleteLaunch = async (flightNumber) => {
  await findLaunch(flightNumber);
  const result = await launches.findOneAndDelete({ flightNumber }).exec();
  return result.modifiedCount === 1;
};

const abortLaunch = async (flightNumber) => {
  await findLaunch(flightNumber);
  return await launches
    .findOneAndUpdate({ flightNumber }, { upcoming: false, success: false }, { new: true })
    .exec();
};

const genFlightNumber = async () => {
  const lastLaunch = await launches.findOne().sort('-flightNumber').exec();
  if (!lastLaunch) {
    return CONFIG.defaultFlightNumber;
  }
  return lastLaunch.flightNumber + 1;
};

// const launch = {
//   flightNumber: 1, // flight_number
//   mission: 'Kepler Exloration XXX', // name
//   rocket: 'Explorer IS1', // rocket.name
//   launchDate: new Date('2024-12-12T00:00:00Z'), // date_local
//   target: 'Kepler-442 b', // not aplicable
//   customers: ['NASA'], // payload.customers for all payloads
//   upcoming: true, // upcoming
//   success: true, // success
// };

// saveLaunch(launch);

module.exports = {
  getAllLaunches: getLaunches,
  createLaunch,
  findLaunch,
  deleteLaunch,
  updateLaunch,
  abortLaunch,
  loadXSpaceLaunches,
};
