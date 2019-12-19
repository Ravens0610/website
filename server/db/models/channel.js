const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate({ User, Video }) {
      Channel.hasMany(Video, {
        foreignKey: 'channelID'
      })
      Channel.belongsTo(User, {
        foreignKey: 'id',
        constraints: false
      })
    }
  }

  Channel.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      desc: DataTypes.TEXT,
      joined: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      subs: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV2,
        primaryKey: true
      }
    },
    { sequelize, tableName: 'channel' }
  )
  return Channel
}
