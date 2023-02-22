const ApiError = require('../exceptions/ApiError');

module.exports = function (error, req, res, next) {
  console.error(error);
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message, errors: error.errors });
  }
  return res.status(500).json({ message: `Internal servev error: ${error.message}` });
};
