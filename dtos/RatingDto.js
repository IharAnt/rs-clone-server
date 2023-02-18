const AchievementProfileDto = require("./AchievementProfileDto");
const UserDto = require("./UserDto");

module.exports = class RatingDto {
  constructor(model) {
  this.id = model.user.id;
  this.user = new UserDto(model.user);
  this.place = model.place;
  this.totalExperience = model.totalExperience;
  this.experiences = model.experiences;
  this.achievements = model.achievements.map((achievement) => new AchievementProfileDto(achievement));
  this.level = model.level;
  this.approvedTasks = model.doneTasks;
  }
}