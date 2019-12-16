const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const { sendResponse, sendError } = require('../utils.js')

const getUser = async (db, id, { email }) => {
  const user = await db.User.findOne({
    where: {
      id
    }
  })
  if (user == null) throw new Error(`Invalid user ID: ${id}`)
  const channels = await db.Channel.findAll({
    where: {
      userID: id
    }
  })
  return {
    id,
    name: user.get('name'),
    email: email ? user.get('email') : null,
    joined: user.get('joined'),
    type: user.get('type'),
    channels: channels.map((channel) => ({
      name: channel.get('name'),
      desc: channel.get('desc'),
      id: channel.get('id'),
      joined: channel.get('joined')
    }))
  }
}

module.exports = ({ db, consola, config }) => {
  const router = express.Router()

  router.get('/getUser', (req, res) => {
    const id = req.query.id
    if (!id) return sendError(res, 'Invalid user ID')
    getUser(db, id, { email: false })
      .then((user) => sendResponse(res, user, null, `v1.auth.getUser`))
      .catch((err) => sendError(res, err))
  })

  router.post('/register', (req, res) => {
    const username = req.body.username
    if (!username) return sendError(res, `Invalid username`)
    const passwd = req.body.password
    if (!passwd) return sendError(res, `Invalid password`)
    const email = req.body.email
    if (!email) return sendError(res, `Invalid email`)
    const bday = req.body.birthday
    if (!bday) return sendError(res, `Invalid birthday`)
    db.User.findOne({
      where: {
        name: username
      }
    })
      .then((user) => {
        if (user) return sendError(res, 'User already exists')
        bcrypt
          .genSalt(10)
          .then((salt) => {
            bcrypt
              .hash(passwd, salt)
              .then((password) => {
                db.User.create({
                  name: username,
                  type: 'default',
                  password,
                  email,
                  bday
                })
                  .then((user) => {
                    getUser(db, user.get('id'), { email: true })
                      .then((user) =>
                        sendResponse(res, user, null, 'v1.auth.register')
                      )
                      .catch((err) => sendError(res, err))
                  })
                  .catch((err) =>
                    sendError(res, `Failed to create user: ${err}`)
                  )
              })
              .catch((err) => sendError(res, err))
          })
          .catch((err) => sendError(res, err))
      })
      .catch((err) =>
        sendError(res, `Failed to check if user already exists: ${err}`)
      )
  })

  router.post('/login', (req, res) => {
    const email = req.body.email
    if (!email) return sendError(res, 'Invalid email')
    const password = req.body.password
    if (!password) return sendError(res, 'Invalid password')
    db.User.findOne({
      where: {
        email
      }
    })
      .then((user) => {
        if (!user) return sendError(res, 'User does not exist')
        bcrypt
          .compare(password, user.get('password'))
          .then((res) => {
            if (!res) return sendError(res, 'Invalid password')
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
            sendResponse(
              res,
              {
                token
              },
              null,
              'v1.auth.login'
            )
          })
          .catch((err) => sendError(res, err))
      })
      .catch((err) => sendError(res, err))
  })

  router.get('/user', (req, res) => {
    const token = req.headers['x-access-token']
    if (!token) return sendError(res, 'Invalid access token')
    try {
      const { userID } = jwt.verify(token, config.jwtKey)
      getUser(db, userID, { email: true })
        .then((user) => sendResponse(res, user, null, `v1.auth.getUser`))
        .catch((err) => sendError(res, err))
    } catch (e) {
      sendError(res, `Invalid access token: ${e}`)
    }
  })

  return router
}
