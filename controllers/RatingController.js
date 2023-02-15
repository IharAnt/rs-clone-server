const ratingService = require("../service/RatingService");

class RatingController {
  async addAchievement(req, res, next) {
    try {
      const achievement = req.body
      const newachievement = await ratingService.addAchievement(achievement);
      return res.json(newachievement);
    } catch (error) {
      next(error);
    }
  }

  async getAchievements(req, res, next) {
    try {
      const achievements = await ratingService.getAchievements();
      return res.json(achievements);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();