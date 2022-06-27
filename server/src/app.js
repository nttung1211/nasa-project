const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); // logger

const CONFIG = require('../constants/config');
const NotFoundError = require('./errors/NotFoundError');
const apiV1 = require('./api');
const { errorHandler, clientErrorHandler } = require('./errors/ErrorHandler');


const app = express();

app.use(cors({
  origin: CONFIG.origin,
}));
// app.use(morgan('combined')); // often be used in production
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(CONFIG.apiPrefix + '/v1', apiV1);

app.use(CONFIG.apiPrefix + '/*', (req, res, next) => {
  next(new NotFoundError('Page not found')); // only go to the next middleware that are not specified the path or has the same path (therefore will not go to the very next middleware)
});
  
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandler, clientErrorHandler);

module.exports = app;