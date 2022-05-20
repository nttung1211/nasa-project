const CustomError = require('./CustomError');

class NotFoundError extends CustomError {
  constructor(...args) {
    super(...args);
    this.status = 404;
  }
}

module.exports = NotFoundError;