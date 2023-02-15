module.exports = class AchievementDto {
  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.imgBlack = model.imgBlack;
    this.imgColor = model.imgColor;
    this.type = model.type;
    this.description = model.description;
    this.maxPoints = model.maxPoints;
  }
};
