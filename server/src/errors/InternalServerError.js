const CustomError = require('./CustomError');

class InternalServerError extends CustomError {
  constructor(...args) {
    super(...args);
    this.status = 500;
  }
}

module.exports = InternalServerError;