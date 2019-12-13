const express = require('express')
const jwt = require('jsonwebtoken')
const { sendResponse, sendError } = require('../utils.js')

module.exports = ({ db, config }) => {
  const router = express.Router()

  router.get('/user', (req, res) => {
    const token = req.headers['x-access-token']
    if (!token) return sendError(res, 'Invalid access token')
    try {
      const { userID } = jwt.verify(token, config.jwtKey)
      db.User.forOne({
        where: {
          id: userID
        }
      })
        .then((user) => {
          db.Channel.forAll({
            where: {
              userID
            }
          })
            .then((channels) => {
              sendResponse(
                res,
                {
                  userID,
                  name: user.name,
                  email: user.email,
                  joined: user.joined,
                  channels: channels.map((channel) => ({
                    name: channel.name,
                    desc: channel.desc,
                    id: channel.id
                  }))
                },
                null,
                null
              )
            })
            .catch((err) => {
              sendError(
                res,
                `Failed to access database channel entry for user ID ${userID}: ${err}`
              )
            })
        })
        .catch((err) => {
          sendError(
            res,
            `Failed to access database user entry for user ID ${userID}: ${err}`
          )
        })
    } catch (e) {
      sendError(res, 'Invalid access token')
    }
  })

  return router
}
