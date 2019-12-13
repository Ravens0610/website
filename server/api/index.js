const express = require('express')

module.exports = (ctx) => {
  const router = express.Router()
  router.use('/auth', require('./auth')(ctx))
  router.use('/videos', require('./videos')(ctx))
  return router
}
