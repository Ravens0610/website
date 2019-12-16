const express = require('express')
const { HTTPError, sendError } = require('../utils.js')

module.exports = (ctx) => {
  const router = express.Router()
  router.use('/auth', require('./auth')(ctx))
  router.use('/videos', require('./videos')(ctx))

  router.use((err, req, res, next) => {
    if (err instanceof HTTPError) {
      sendError(res, err)
    } else next(err)
  })
  return router
}
