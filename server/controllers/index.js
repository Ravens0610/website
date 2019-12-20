module.exports = (db, config) => {
  const add = (name) => ({ [name]: require(`./${name}`)(db, config) })

  return {
    ...add('auth'),
    ...add('channel'),
    ...add('videos')
  }
}
