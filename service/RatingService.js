const AchievementDto = require('../dtos/AchievementDto');
const ApiError = require('../exceptions/ApiError');
const {Achievement} = require('../models/AchievementModel');
const { Profile } = require('../models/ProfileModel');
const profileService = require('./ProfileService');

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

  async addAchivementToProfile(userId, achievementId) {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw ApiError.BadRequest("Profile not foun");
    }
    // profile.achievements = []
    profile.achievements.push(achievementId);
    await profile.save();
    return profileService.getProfile(userId);
  }
}

module.exports = new RatingService();