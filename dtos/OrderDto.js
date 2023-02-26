const ProductDto = require('./ProductDto');

module.exports = class OrderDto {
  constructor(model) {
    this.id = model._id;
    this.userId = model.user._id;
    this.product = new ProductDto(model.product);
    this.count = model.count;
  }
};
