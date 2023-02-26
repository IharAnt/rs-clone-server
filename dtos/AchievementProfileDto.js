module.exports = class AchievementProfileDto {
  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.type = model.type;
    this.description = model.description;
    this.maxPoints = model.maxPoints;
  }
};
