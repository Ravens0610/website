const fs = require('fs')
const path = require('path')
const express = require('express')
const jwt = require('jsonwebtoken')
const { getUserToken, HTTPError, sendResponse } = require('../utils.js')

module.exports = ({ db, controllers, consola, config }) => {
  const router = express.Router()

  router.get('/getUser', (req, res, next) => {
    const id = /^[0-9A-F]{10}-[0-9A-F]{4}-4[0-9A-F]{4}-[89AB][0-9A-F]{4}-[0-9A-F]{12}$/i.test(
      req.query.id
    )
    if (!id) return next(new HTTPError('Invalid user ID'))
    controllers.auth
      .getUser({ id })
      .then((user) => sendResponse(res, user.toJSON(), null, 'v1.auth.getUser'))
      .catch((err) => next(new HTTPError(err.message)))
  })

  router.get('/avatar', (req, res, next) => {
    const id = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      req.query.id
    )
    if (!id) return next(new HTTPError('Invalid user ID'))
    const p = path.join(__dirname, '..', '..', '.data', 'avatars', `${id}.png`)
    const stat = fs.statSync(p)
    const fileSize = stat.size
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'image/png'
    })
    fs.createReadStream(p).pipe(res)
  })

  router.post('/register', (req, res, next) => {
    const username = req.body.username
    if (!username) return next(new HTTPError('Invalid username'))
    const passwd = req.body.password
    if (!passwd) return next(new HTTPError('Invalid password'))
    const email = req.body.email
    if (!email) return next(new HTTPError('Invalid email'))
    const bday = req.body.birthday
    if (!bday) return next(new HTTPError('Invalid birthday'))

    controllers.auth
      .register(username, passwd, email, bday)
      .then((user) =>
        sendResponse(res, user.toJSON(), null, 'v1.auth.register')
      )
      .catch((err) => next(new HTTPError(err)))
  })

  router.post('/login', (req, res, next) => {
    const email = req.body.email
    if (!email) return next(new HTTPError('Invalid email'))
    const password = req.body.password
    if (!password) return next(new HTTPError('Invalid password'))

    controllers.auth
      .login(email, password)
      .then((res) => sendResponse(res, res, null, 'v1.auth.login'))
      .catch((err) => next(new HTTPError(err)))
  })

  router.get('/user', (req, res, next) => {
    const token = getUserToken(req)
    if (!token) return next(new HTTPError('Invalid access token'))
    try {
      const { userID } = jwt.verify(token, config.jwtKey, {
        complete: true
      }).payload.data
      controllers.auth
        .getUser({ id: userID })
        .then((user) =>
          sendResponse(res, user.toJSON(), null, 'v1.auth.getUser')
        )
        .catch((err) => next(new HTTPError(err)))
    } catch (e) {
      next(new HTTPError(`Invalid access token: ${e}`))
    }
  })

  return router
}
