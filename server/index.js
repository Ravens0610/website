const compression = require('compression')
const consola = require('consola')
const express = require('express')
const helmet = require('helmet')
const { Builder, Nuxt } = require('nuxt')
const { Model, Sequelize } = require('sequelize')

const app = express()

// Database stuff
const sequelize = new Sequelize('sqlite:.nuxt/database.db')

class Channel extends Model {}

Channel.init(
  {
    name: { type: Sequelize.STRING, allowNull: false },
    desc: Sequelize.TEXT,
    joined: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV2,
      primaryKey: true
    }
  },
  { sequelize, modelName: 'channel' }
)

class Video extends Model {}

Video.init(
  {
    title: { type: Sequelize.STRING, allowNull: false },
    desc: Sequelize.TEXT,
    uploaded: { type: Sequelize.DATE, defaultVaue: Sequelize.NOW },
    likes: { type: Sequelize.INTEGER, defaultValue: 0 },
    dislikes: { type: Sequelize.INTEGER, defaultValue: 0 },
    channelID: { type: Sequelize.UUID, allowNull: false },
    targetAudience: {
      type: Sequelize.ENUM,
      values: ['children', 'teens', 'everyone']
    },
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV2,
      primaryKey: true
    }
  },
  { sequelize, modelName: 'video' }
)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  await sequelize.sync()

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(compression())
  app.use(helmet())

  app.get('/api/v1/searchVideos', (req, res, next) => {
    if (!req.query.query) return next()
    if (!req.query.page) req.query.page = 0
    else req.query.page = parseInt(req.query.page)
    Video.findAll({
      where: {
        title: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('title')),
          'LIKE',
          '%' + req.query.query + '%'
        )
      },
      limit: 10,
      offset: req.query.page
    })
      .then((videos) => {
        console.log(videos)
        res.json({})
      })
      .catch((err) => res.status(500).json(err))
  })

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
