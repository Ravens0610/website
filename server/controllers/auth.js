const bcrypt = require('bcrypt')

module.exports = ({ User }) => {
  const hasUser = async (where) => {
    const user = await User.findOne({ where })
    return user !== null
  }
  const register = async (username, passwd, email, bday) => {
    if (await hasUser({ username }))
      throw new Error('User already exists with that username')
    if (await hasUser({ email }))
      throw new Error('User already exists with that E-Mail')

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passwd, salt)

    const user = await User.create({
      username,
      password,
      email,
      bday
    })
    return user
  }
  return { hasUser, register }
}
