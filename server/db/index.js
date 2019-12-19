const path = require('path')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', '.data', 'nerovi.db')
})

const Channel = sequelize.import('./models/channel')
const User = sequelize.import('./models/user')
const Video = sequelize.import('./models/video')

module.exports = { User, Video, Channel, sequelize }
