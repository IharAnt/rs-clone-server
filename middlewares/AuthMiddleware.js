const ApiError = require('../exceptions/ApiError');
const tokenService = require('../service/TokenService');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw ApiError.UnauthorizedError();
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    req.user = userData;
    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
};
