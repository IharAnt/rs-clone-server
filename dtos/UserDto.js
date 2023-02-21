module.exports = class UserDto {
  id;
  email;
  name;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.name = model.name;
  }
};
