const AchievementDto = require('../dtos/AchievementDto');
const ApiError = require('../exceptions/ApiError');
const {Achievement} = require('../models/AchievementModel');

class RatingService {
  async addAchievement(achievement) {
    const newAchievement = await Achievement.create(achievement);
    const result = new AchievementDto(newAchievement);
    return result;
  }

  async getAchievements() {
    const achievements = await Achievement.find();
    const result = achievements.map((newAchievement) => new AchievementDto(newAchievement));
    return result;
  }
}

module.exports = new RatingService();