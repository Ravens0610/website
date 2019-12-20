const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    static associate({ User }) {
      UserToken.belongsTo(User, {
        foreignKey: 'id',
        constraints: false
      })
    }
  }

  UserToken.init(
    {
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      value: {
        type: DataTypes.STRING(133),
        allowNull: false
      }
    },
    { sequelize, tableName: 'userToken' }
  )
  return UserToken
}
