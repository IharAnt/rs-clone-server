const AchievementProfileDto = require('./AchievementProfileDto');

module.exports = class ProfiletDto {
  constructor(model, { nextLevelExperience, tasksStatus }) {
    this.id = model.user._id;
    this.name = model.user.name;
    this.email = model.user.email;
    this.birthday = model.birthday;
    this.phone = model.phone;
    this.photo = model.photo;
    this.moticoins = model.moticoins;
    this.totalExperience = model.totalExperience;
    this.experiences = model.experiences;
    this.achievements = model.achievements.map((achievement) => new AchievementProfileDto(achievement));
    this.tasksStatus = tasksStatus;
    this.nextLevelExperience = nextLevelExperience;
    this.level = model.level;
    this.doneTasks = model.doneTasks;
  }
};
