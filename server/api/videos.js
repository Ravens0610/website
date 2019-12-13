const express = require('express')
const { sendResponse, sendError } = require('../utils.js')

const getChannel = async (db, id) => {
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
  const channel = await getChannel(db, video.channelID)
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

module.exports = ({ db, consola }) => {
  const router = express.Router()

  router.get('/search', (req, res, next) => {
    if (!req.query.query) return sendError(res, 'Invalid query parameter')
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
      offset: req.query.page,
      attributes: ['id']
    })
      .then((videos) => {
        Promise.all(videos.map(({ id }) => getVideo(db, id)))
          .then((videos) => sendResponse(res, videos, null, 'v1.videos.search'))
          .catch((err) => sendError(res, err))
      })
      .catch((err) => sendError(res, err))
  })

  return router
}
