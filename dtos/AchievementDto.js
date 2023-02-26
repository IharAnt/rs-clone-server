module.exports = class AchievementDto {
  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.img = model.img;
    this.type = model.type;
    this.description = model.description;
    this.maxPoints = model.maxPoints;
  }
};
