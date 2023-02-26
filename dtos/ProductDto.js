module.exports = class ProductDto {
  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.description = model.description;
    this.price = model.price;
    this.brand = model.brand;
    this.category = model.category;
    this.thumbnail = model.thumbnail;
  }
};
