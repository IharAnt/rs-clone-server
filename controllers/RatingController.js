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

  async getRating(req, res, next) {
    try {
      const {_page, _limit, _sort, _order, _search} = req.query
      const ratings = await ratingService.getRating(_page, _limit, _sort, _order, _search);
      return res.json(ratings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();