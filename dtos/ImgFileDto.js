module.exports = class ImgFileDto {
  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.data = model.data;
  }
};
