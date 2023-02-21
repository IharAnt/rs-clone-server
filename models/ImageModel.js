const { Schema, model } = require('mongoose');

const ImageSchema = new Schema({
  name: { type: String, required: true },
  data: { type: String },
});

module.exports = model('Image', ImageSchema);

module.exports = ImageSchema;
