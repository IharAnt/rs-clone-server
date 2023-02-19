const ShopService = require("../service/ShopService");

class ShopController {
  async addProduct(req, res, next) {
    try {
      const product = req.body
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
}

module.exports = new ShopController();
