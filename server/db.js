const { Model, Sequelize } = require('sequelize')
const uuidv4 = require('uuid/v4')

const sequelize = new Sequelize('sqlite:.nuxt/database.db')

class User extends Model {}

User.init(
  {
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    joined: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    bday: { type: Sequelize.DATE, allowNull: false },
    tokens: { type: Sequelize.JSON },
    type: {
      type: Sequelize.ENUM,
      values: ['default', 'admin']
    },
    id: {
      type: Sequelize.UUID,
      defaultValue: () => {
        return uuidv4()
      },
      primaryKey: true
    }
  },
  { sequelize, modelName: 'user' }
)

class Channel extends Model {}

Channel.init(
  {
    name: { type: Sequelize.STRING, allowNull: false },
    desc: Sequelize.TEXT,
    joined: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    userID: { type: Sequelize.UUID, allowNull: false },
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

module.exports = { User, Video, Channel, sequelize }
