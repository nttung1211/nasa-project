const CustomError = require('./CustomError');

class BadRequestError extends CustomError {
  constructor(...args) {
    super(...args);
    this.status = 400;
  }
}

module.exports = BadRequestError;