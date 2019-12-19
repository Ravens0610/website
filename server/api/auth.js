const fs = require('fs')
const path = require('path')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserToken, HTTPError, sendResponse } = require('../utils.js')

module.exports = ({ db, controllers, consola, config }) => {
  const router = express.Router()

  router.get('/getUser', (req, res, next) => {
    const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      req.query.id
    )
    if (!id) return next(new HTTPError('Invalid user ID'))
    controllers.auth
      .getUser(id, { email: false })
      .then((user) => sendResponse(res, user, null, `v1.auth.getUser`))
      .catch((err) => next(new HTTPError(err.message)))
  })

  router.get('/avatar', (req, res, next) => {
    const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
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
    db.User.findOne({
      where: {
        email
      }
    })
      .then(async (user) => {
        if (!user) return next(new HTTPError('User does not exist'))
        const isValid = await bcrypt.compare(password, user.get('password'))
        if (!isValid) return next(new HTTPError('Invalid password'))
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            data: {
              userID: user.id
            }
          },
          config.jwtKey
        )
        const tokens = user.get('tokens') || []
        tokens.push(token)
        user.set('tokens', tokens)
        return user.save().then(() =>
          sendResponse(
            res,
            {
              token
            },
            null,
            'v1.auth.login'
          )
        )
      })
      .catch((err) => next(new HTTPError(err)))
  })

  router.get('/user', (req, res, next) => {
    const token = getUserToken(req)
    if (!token) return next(new HTTPError('Invalid access token'))
    try {
      const { userID } = jwt.verify(token, config.jwtKey, {
        complete: true
      }).payload.data
      db.User.findOne({
        where: {
          id: userID
        }
      })
        .then((user) =>
          sendResponse(res, user.toJSON(), null, `v1.auth.getUser`)
        )
        .catch((err) => next(new HTTPError(err)))
    } catch (e) {
      next(new HTTPError(`Invalid access token: ${e}`))
    }
  })

  return router
}
