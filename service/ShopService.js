const OrderDto = require("../dtos/OrderDto");
const ProductDto = require("../dtos/ProductDto");
const ApiError = require("../exceptions/ApiError");
const { Order } = require("../models/OrderModel");
const { Product } = require("../models/ProductModel");
const { Profile } = require("../models/ProfileModel");

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

  async addOrders(userId, cartProducts) {
    const result = [];
    for (const cartProduct of cartProducts) {
      let newOrder = await Order.findOneAndUpdate(
        { user: userId, product: cartProduct.product.id },
        { $inc: { count: cartProduct.count } },
        { upsert: true, new: true }
      )
        .populate("user")
        .populate("product");
      result.push(new OrderDto(newOrder));
    }
    const totalPrice = cartProducts.reduce(
      (agr, cartProduct) => agr + cartProduct.count * cartProduct.product.price,
      0
    );
    await Profile.updateOne(
      { user: userId },
      { $inc: { moticoins: -totalPrice } }
    );
    return result;
  }

  async getOrders(userId) {
    const products = await Order.find({ user: userId })
      .populate("user")
      .populate("product");
    const result = products.map((product) => new OrderDto(product));
    return result;
  }
}

module.exports = new ShopService();
