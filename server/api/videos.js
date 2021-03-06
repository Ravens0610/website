const fs = require('fs')
const path = require('path')
const express = require('express')
const { HTTPError, sendResponse } = require('../utils.js')

module.exports = ({ db, controllers, consola }) => {
  const router = express.Router()

  router.get('/stream/:id', (req, res, next) => {
    const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      req.query.id
    )
    if (!id) return next(new HTTPError('Invalid video ID'))
    db.Video.findOne({
      where: {
        id
      }
    })
      .then((video) => {
        if (!video)
          return next(new HTTPError(`Video ${req.params.id} does not exist`))
        const p = path.join(
          __dirname,
          '..',
          '..',
          '.data',
          'videos',
          video.id + '.mp4'
        )
        const stat = fs.statSync(p)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
          const parts = range.replace(/bytes=/, '').split('-')
          const start = parseInt(parts[0], 10)
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
          const chunkSize = end - start + 1
          const file = fs.createReadStream(p, { start, end })
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
          })
          file.pipe(res)
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
          })
          fs.createReadStream(p).pipe(res)
        }
      })
      .catch((err) => next(new HTTPError(err)))
  })

  router.get('/search', (req, res, next) => {
    if (!req.query.query) return next(new HTTPError('Invalid query parameter'))
    if (!req.query.page) req.query.page = 0
    else req.query.page = parseInt(req.query.page, 10)
    if (isNaN(req.query.page)) return next(new HTTPError('Invalid page'))
    controllers.videos
      .search(req.query.query, req.query.page)
      .then((data) => sendResponse(res, data, null, 'v1.videos.search'))
      .catch((err) => new HTTPError(err))
  })

  return router
}
