const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = ({ User, UserToken }, config) => {
  const getUser = async (where) => {
    const user = await User.findOne({ where })
    if (!user) throw new Error('No such user exists')
    return user
  }
  const hasUser = async (where) => {
    const user = await User.findOne({ where })
    return user !== null
  }
  const login = async (email, password) => {
    const user = await getUser({ email })

    const isValidPassword = await bcrypt.compare(password, user.get('password'))
    if (!isValidPassword) throw new Error('Invalid password')

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31,
        data: { userID: user.get('id') }
      },
      config.jwtKey
    )

    await UserToken.create({
      userID: user.get('id'),
      value: token
    })

    return { token }
  }
  const register = async (username, passwd, email, bday) => {
    if (await hasUser({ username }))
      throw new Error('User already exists with that username')
    if (await hasUser({ email }))
      throw new Error('User already exists with that E-Mail')

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passwd, salt)

    return User.create({
      username,
      password,
      email,
      bday
    })
  }
  return { getUser, hasUser, login, register }
}
