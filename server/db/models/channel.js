const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {}

  Channel.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      desc: DataTypes.TEXT,
      joined: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      userID: { type: DataTypes.UUID, allowNull: false },
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
    { sequelize }
  )
  return Channel
}
