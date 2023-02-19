const ProductDto = require("../dtos/ProductDto");
const ApiError = require("../exceptions/ApiError");
const { Product } = require("../models/ProductModel");

class ShopService {
  async addProduct(product) {
    let newProduct = await Product.create(product);
    const result = new ProductDto(newProduct);
    return result;
  }

  async getProducts() {
    const products = await Product.find();
    const result = products.map((product) => new ProductDto(product));
    return result;
  }
}

module.exports = new ShopService();