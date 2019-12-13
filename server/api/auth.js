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
    name: user.name,
    email: email ? user.email : null,
    joined: user.joined,
    channels: channels.map((channel) => ({
      name: channel.name,
      desc: channel.desc,
      id: channel.id,
      joined: channel.joined
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
    const passwd = req.body.passwd
    if (!passwd) return sendError(res, `Invalid password`)
    const email = req.body.email
    if (!email) return sendError(res, `Invalid email`)
    db.User.findOne({
      where: {
        name: username
      }
    })
      .then((user) => {
        if (user) return sendError(res, 'User already exists')
        // TODO: create user
      })
      .catch((err) =>
        sendError(res, `Failed to check if user already exists: ${err}`)
      )
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
