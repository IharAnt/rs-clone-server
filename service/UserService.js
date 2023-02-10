const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./MailService');
const tokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');
const ApiError = require('../exceptions/ApiError');

class UserService {
  async registration(email, password, name) {
    const user = await UserModel.findOne({ email });
    if (user) {
      throw ApiError.BadRequest(`User ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    // const activationLInk = uuid.v4();
    const newUser = await UserModel.create({ email, password: hashedPassword, name });
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLInk}`);
    
    return await this.generateTokenData(newUser);
  }

  async activate(link) {
    const user = await UserModel.findOne({ activationLink: link});
    if (!user) {
      throw ApiError.BadRequest('Activation link is invalid');
    }
    user.isActivated = true;
    user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.BadRequest('Invalid password');
    }

    return await this.generateTokenData(user);
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const token = await tokenService.findToken(refreshToken);
    if (!token || !userData) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    return await this.generateTokenData(user);
  }

  async getUsers() {
    const users = await UserModel.find();
    return users;
  }

  async generateTokenData(user) {
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();