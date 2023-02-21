const ShopService = require('../service/ShopService');

class ShopController {
  async addProduct(req, res, next) {
    try {
      const product = req.body;
      const newProduct = await ShopService.addProduct(product);
      return res.json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const products = await ShopService.getProducts();
      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async addOrders(req, res, next) {
    try {
      const userId = req.params.userId;
      const cartProducts = req.body;
      const orders = await ShopService.addOrders(userId, cartProducts);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const userId = req.params.userId;
      const orders = await ShopService.getOrders(userId);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShopController();
