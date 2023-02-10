const userService = require('../service/UserService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Registration error', errors.array()));
      }
      const {email, password, name} = req.body; 
      const userData = await userService.registration(email, password, name);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLInk = req.params.link;
      await userService.activate(activationLInk);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(['123']);
    } catch (error) {
      
    }
  }

}

module.exports = new UserController();