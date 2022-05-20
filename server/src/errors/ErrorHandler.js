const CustomError = require('./CustomError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status);
  } else {
    res.status(500);
    console.error('Unhandled error occured: ', err);
  } 
  
  res.json({
    error: {
      message: err.message,
    }
  });
}

module.exports = errorHandler;