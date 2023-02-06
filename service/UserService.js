const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./MailService');
const tokenService = require('./TokenService');
const UserDto = require('../dtos/UserDto');

class UserService {
  async registration(email, password, name) {
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error(`User ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    // const activationLInk = uuid.v4();
    const newUser = await UserModel.create({ email, password: hashedPassword, name });
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLInk}`);
    
    const userDto = new UserDto(newUser);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(link) {
    const user = await UserModel.findOne({ activationLink: link});
    if (!user) {
      throw new Error('Activation link is invalid');
    }
    user.isActivated = true;
    user.save();
  }
}

module.exports = new UserService();