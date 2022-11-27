const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const tokenService = require('./token-service') 
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions')

class UserService {
  async signup({ email, password, age, name }) {
    const candidate = await User.findOne({ email })
    if(candidate) {
      throw ApiError.BadRequest('Пользователь с таким email уже существует')
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = User.create({ email, password: hashPassword, age, name })

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async signin(email, password) {
    const candidate = await User.findOne({ email })

    if(!candidate || !(await bcrypt.compare(password, candidate.password))) {
      throw ApiError.BadRequest('Неправильный логин или пароль')
    }

    const userDto = new UserDto(candidate)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedUser()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if(!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedUser()
    }

    const user = await User.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    const users = await User.find({}, '-password')
    return users
  }

  async getUserById(id) {
    const candidate = await User.findById(id, '-password')
    if(!candidate) {
      throw ApiError.BadRequest('Пользователь с таким ID не найден')
    }

    return candidate
  }

  async getMe(accessToken) {
    const userData = tokenService.validateAccessToken(accessToken)
    const candidate = await User.findById(userData.id, '-password')
    if(!candidate) {
      throw ApiError.BadRequest('Пользователь с таким ID не найден')
    }

    return candidate
  }

  async updateUser(id, data) {
    const candidate = await User.findById(id, '-password')
    if(!candidate) {
      throw ApiError.BadRequest('Пользователь с таким ID не найден')
    }

    delete data.id
    delete data._id

    Object.assign(candidate, data)
    await candidate.save()

    return candidate
  }

  async deleteUser(id) {
    const candidate = await User.findByIdAndDelete(id)

    if(!candidate) {
      throw ApiError.BadRequest('Пользователь с таким ID не найден')
    }
  }
}

module.exports = new UserService()