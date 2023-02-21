const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  brand: { type: String, require: true },
  category: { type: String, require: true },
  thumbnail: { type: String, require: true },
});

const Product = model('Product', ProductSchema);

module.exports = { Product, ProductSchema };
