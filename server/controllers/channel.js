const DAY_IN_MS = 1000 * 3600 * 24

module.exports = ({ Channel, User }, config) => {
  const exists = async (name) => {
    const channel = await Channel.findOne({ where: { name } })
    return channel !== null
  }
  const create = async (name, userID, desc = '') => {
    const user = await User.findOne({ where: { id: userID } })
    if (user == null) throw new Error('User must be logged in')
    if (user.age < 13)
      throw new Error(
        'User must be older than 13 years old to create a channel'
      )
    if (user.timeSinceJoined.getTime() / DAY_IN_MS < 7)
      throw new Error(
        'User must have been on the platform for a week before creating a channel'
      )
    if (await exists(name))
      throw new Error('Channel already exists with that name')

    return Channel.create({
      name,
      desc,
      userID
    })
  }

  return { create, exists }
}
