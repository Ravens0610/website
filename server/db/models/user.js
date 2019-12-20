const { Model } = require('sequelize')
const uuidv4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Channel, UserToken }) {
      User.hasMany(UserToken, {
        foreignKey: 'userID'
      })
      User.hasMany(Channel, {
        foreignKey: 'ownerID'
      })
    }
  }

  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      joined: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      bday: { type: DataTypes.DATE, allowNull: false },
      type: {
        type: DataTypes.ENUM,
        values: ['default', 'admin']
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: () => {
          return uuidv4()
        },
        primaryKey: true
      }
    },
    { sequelize, tableName: 'user' }
  )
  return User
}
