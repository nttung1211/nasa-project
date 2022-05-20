const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const isHabitable = (planet) => {
  return (
    planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
};

const parser = parse({
  comment: '#',
  columns: true,
});

const loadPlanetData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parser)
      .on('data', async (planet) => {
        if (isHabitable(planet)) {
          await savePlanet(planet);
        }
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('end', () => {
        resolve();
      });
  });
};

const savePlanet = async (planet) => {
  try {
    await planets.updateOne(
      {
        
        keplerName: planet.kepler_name, // filter condition
      },
      {
        keplerName: planet.kepler_name, // data to update or insert
      },
      // options
      {
        upsert: true, // update if exist otherwise insert
      }
    );
  } catch (error) {
    console.error('could not save planet: ' + error);
  }
};

const getAllPlanets = async () =>
  await planets.find(
    {
      keplerName: /.+/,
    },
    {
      keplerName: 1, 
      _id: 0
    }
    // alternative way: 'keplerName, -_id'
  );

module.exports = {
  getAllPlanets,
  loadPlanetData,
};
