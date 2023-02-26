const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  count: { type: Number, require: true },
});

const Order = model('Order', OrderSchema);

module.exports = { Order, OrderSchema };
