const AchievementProfileDto = require("./AchievementProfileDto");
const UserDto = require("./UserDto");

module.exports = class RatingDto {
  constructor(model, usersPlaces) {
    const place = usersPlaces.find(
      (userplace) => model.user._id.toString() === userplace.user._id.toString()
    )?.place;
    this.id = model.user._id;
    this.user = new UserDto(model.user);
    this.place = place;
    this.totalExperience = model.totalExperience;
    this.experiences = model.experiences;
    this.achievements = model.achievements.map(
      (achievement) => new AchievementProfileDto(achievement)
    );
    this.level = model.level;
    this.approvedTasks = model.doneTasks;
  }
};
