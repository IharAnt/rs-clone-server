const jwt = require('jsonwebtoken');
const TokenModel = require('../models/TokenModel');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: '60m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: '20d',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const token = await TokenModel.findOne({ user: userId });
    if(token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    const newToken = await TokenModel.create({user: userId, refreshToken});
    return newToken;
  }

  async removeToken(refreshToken) {
    const token = await TokenModel.deleteOne({ refreshToken });
    return token;
  }
}

module.exports = new TokenService();