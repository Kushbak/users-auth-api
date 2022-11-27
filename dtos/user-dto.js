module.exports = class UserDto {
  email
  name
  age
  id

  constructor(model) {
    this.email = model.email
    this.name = model.name
    this.age = model.age
    this.id = model._id
  }
}