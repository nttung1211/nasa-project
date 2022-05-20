require('dotenv').config();
import http from 'http';
const app = require('./app');

const { loadLaunchesData } = require('./models/launches.model');
const { loadPlanetData } = require('./models/planets.model');
const { mongoConnect } = require('./utils/mongo');

const server = http.createServer(app); // express app is just a listener function (or a middleware that we can add on top of the built-in http server)

const startServer = async () => {
  await mongoConnect();
  await loadPlanetData();
  // await loadLaunchesData();

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
