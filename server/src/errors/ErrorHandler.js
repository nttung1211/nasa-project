const CustomError = require('./CustomError');

const errorHandler = (err, req, res, next) => {
  console.error(err instanceof CustomError ? 'Error: ' : 'Unhandled error: ', err);
  next(err);
};

const clientErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status);
  } else {
    res.status(500);
    err.message = 'Something went wrong!';
  }

  res.json({
    error: {
      message: err.message,
    },
  });
};

module.exports = {
  errorHandler,
  clientErrorHandler,
};
