const UserDto = require("./UserDto");

module.exports = class MessageDto {
  constructor(model) {
    this.message = model.message;
    this.author = new UserDto(model.author);
  }
};