const bodyParser = require('body-parser')
const compression = require('compression')
const consola = require('consola')
const express = require('express')
const helmet = require('helmet')
const { Builder, Nuxt } = require('nuxt')

const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const db = require('./db')

async function start() {
  await db.sequelize.sync()

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
  app.use(bodyParser())
  app.use(compression())
  app.use(helmet())
  app.use('/api/v1', require('./api')({ db, consola, config }))

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()