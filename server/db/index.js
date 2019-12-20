const path = require('path')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', '.data', 'nerovi.db')
})

const Channel = sequelize.import('./models/channel')
const User = sequelize.import('./models/user')
const UserToken = sequelize.import('./models/user-token')
const Video = sequelize.import('./models/video')

const models = { Channel, User, UserToken, Video }
Object.keys(models).forEach((name) => {
  if (models[name].associate) {
    models[name].associate(models)
  }
})

module.exports = { ...models, sequelize }
