const fs = require('fs')
const path = require('path')
const express = require('express')
const { HTTPError, sendResponse } = require('../utils.js')

module.exports = ({ db, consola }) => {
  const router = express.Router()

  const getChannel = async (id) => {
    const channel = await db.Channel.findOne({
      where: {
        id
      }
    })
    return {
      id,
      name: channel.name,
      desc: channel.desc,
      joined: channel.joined,
      userID: channel.userID
    }
  }

  const getVideo = async (db, id) => {
    const video = await db.Video.findOne({
      where: {
        id
      }
    })
    const channel = await getChannel(video.channelID)
    return {
      id,
      title: video.title,
      desc: video.desc,
      likes: video.likes,
      dislikes: video.dislikes,
      uploaded: video.uploaded,
      targetAudience: video.targetAudience,
      channel
    }
  }

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
    const where = {
      title: db.sequelize.where(
        db.sequelize.fn('LOWER', db.sequelize.col('title')),
        'LIKE',
        '%' + req.query.query + '%'
      )
    }
    if (!req.query.page) {
      db.Video.findAll({
        where,
        attributes: ['id']
      })
        .then((videos) => Promise.all(videos.map(({ id }) => getVideo(id))))
        .then((videos) =>
          sendResponse(res, { videos }, null, 'v1.videos.search')
        )
        .catch((err) => next(new HTTPError(err)))
    } else {
      req.query.page = parseInt(req.query.page)
      const offset = req.query.page * 10
      db.Video.findAndCountAll({
        where,
        attributes: ['id']
      })
        .then(({ row, count }) =>
          Promise.all(
            row
              .slice(offset, offset + 10)
              .map((video) => getVideo(video.get('id')))
          ).then((videos) =>
            sendResponse(res, {
              videos,
              count: videos.length,
              total: count,
              pages: Math.ceil(count / 10)
            })
          )
        )
        .catch((err) => next(new HTTPError(err)))
    }
  })

  return router
}
