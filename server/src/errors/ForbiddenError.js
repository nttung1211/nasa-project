const CustomError = require('./CustomError');

class ForbiddenError extends CustomError {
  constructor(...args) {
    super(...args);
    this.status = 403;
  }
}

module.exports = ForbiddenError;