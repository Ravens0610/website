module.exports = (db) => {
  const add = (name) => ({ [name]: require(`./${name}`)(db) })

  return {
    ...add('auth'),
    ...add('videos')
  }
}
