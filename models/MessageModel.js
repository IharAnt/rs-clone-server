const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Message', MessageSchema);

module.exports = MessageSchema;
