const { Schema, model } = require('mongoose');
const MessageSchema = require('./MessageModel');
const ImageSchema = require('./ImageModel');

const TaskSchema = new Schema({
  executor: { type: Schema.Types.ObjectId, ref: 'User' },
  inspector: { type: Schema.Types.ObjectId, ref: 'User' },
  icon: { type: String },
  summary: { type: String },
  description: { type: String },
  dueDate: { type: String },
  type: { type: String },
  status: { type: String },
  taskReport: { type: String },
  messages: [MessageSchema],
  imgFiles: [ImageSchema],
  points: { type: Number },
});

const Task = model('Task', TaskSchema);

module.exports = { Task, TaskSchema };
