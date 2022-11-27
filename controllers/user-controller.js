const userService = require('../services/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions')

class UserController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const userData = await userService.signup(req.body)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
  
      return res.json({ message: 'Регистрация прошла успешно' })
    } catch(e) {
      next(e)
    }
  }

  async signin(req, res, next) {
    const { email, password } = req.body
    try {
      const userData = await userService.signin(email, password)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      
      return res.json(userData)
    } catch(e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch(e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      
      return res.json(userData)
    } catch(e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      return res.json(users)
    } catch(e) {
      next(e)
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id)
      return res.json(user)
    } catch(e) {
      next(e)
    }
  }

  async getMe(req, res, next) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1]
      const user = await userService.getMe(accessToken)
      return res.json(user)
    } catch(e) {
      next(e)
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body)
      return res.json(user)
    } catch(e) {
      next(e)
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id)
      return res.status(204).json({ message: 'Пользователь успешно удален' })
    } catch(e) {
      next(e)
    }
  }
}

module.exports = new UserController()