const ImgFileDto = require("./ImgFileDto");
const MessageDto = require("./MessageDto");
const UserDto = require("./UserDto");

module.exports = class TaskDto {
  constructor(model) {
    this.id = model._id;
    this.executor = new UserDto(model.executor);
    this.inspector = new UserDto(model.inspector);
    this.icon = model.icon;
    this.summary = model.summary;
    this.description = model.description;
    this.dueDate = model.dueDate;
    this.type = model.type;
    this.status = model.status;
    this.taskReport = model.taskReport;
    this.messages = model.messages.map((message) => new MessageDto(message));
    this.imgFiles = model.imgFiles.map((img) => new ImgFileDto(img));
    this.points = model.points;
  }
};
