module.exports = class ApiError extends Error {
  erorrs
  status

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedUser() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }
}