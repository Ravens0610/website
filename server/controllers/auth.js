module.exports = (db) => {
  const getUser = async (id, { email }) => {
    const user = await db.User.findOne({
      where: {
        id
      }
    })
    if (user == null) throw new Error(`Invalid user ID: ${id}`)
    const channels = await db.Channel.findAll({
      where: {
        userID: id
      }
    })
    return {
      id,
      name: user.get('name'),
      email: email ? user.get('email') : null,
      joined: user.get('joined'),
      type: user.get('type'),
      channels
    }
  }
  return { getUser }
}
