const express = require('express')
const { sendResponse, sendError } = require('../utils.js')

module.exports = ({ db, consola }) => {
  const router = express.Router()

  router.get('search', (req, res, next) => {
    if (!req.query.query) return next()
    if (!req.query.page) req.query.page = 0
    else req.query.page = parseInt(req.query.page)
    db.Video.findAll({
      where: {
        title: db.sequelize.where(
          db.sequelize.fn('LOWER', db.sequelize.col('title')),
          'LIKE',
          '%' + req.query.query + '%'
        )
      },
      limit: 10,
      offset: req.query.page
    })
      .then((videos) => {
        consola.info(videos)
        sendResponse(res, {}, null, 'v1.videos.search')
      })
      .catch((err) => sendError(res, err))
  })

  return router
}
