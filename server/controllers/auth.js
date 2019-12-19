const bcrypt = require('bcrypt')

module.exports = ({ User }) => {
  const hasUser = async (where) => {
    const user = await User.findOne({ where })
    return user !== null
  }
  const register = async (name, passwd, email, bday) => {
    if (await hasUser({ name }))
      throw new Error('User already exists with that name')
    if (await hasUser({ email }))
      throw new Error('User already exists with that E-Mail')

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passwd, salt)

    const user = await User.create({
      name,
      password,
      email,
      bday
    })
    return user
  }
  return { hasUser, register }
}
