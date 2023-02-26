const { Schema, model } = require('mongoose');

const LevelSchema = new Schema({
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
});

const Level = model('Level', LevelSchema);

module.exports = { Level, LevelSchema };
