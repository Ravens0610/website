const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate({ Channel }) {
      Video.belongsTo(Channel, {
        foreignKey: 'id',
        constraints: false
      })
    }
  }

  Video.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      desc: DataTypes.TEXT,
      uploaded: { type: DataTypes.DATE, defaultVaue: DataTypes.NOW },
      likes: { type: DataTypes.INTEGER, defaultValue: 0 },
      dislikes: { type: DataTypes.INTEGER, defaultValue: 0 },
      channelID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'channel',
          key: 'id'
        }
      },
      type: {
        type: DataTypes.ENUM,
        values: ['video', 'livestream', 'ad'],
        defaultValue: 'video'
      },
      targetAudience: {
        type: DataTypes.ENUM,
        values: ['children', 'teens', 'everyone']
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV2,
        primaryKey: true
      }
    },
    { sequelize, tableName: 'video' }
  )
  return Video
}
