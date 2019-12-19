module.exports = (db) => {
  const getChannel = async (id) => {
    const channel = await db.Channel.findOne({
      where: {
        id
      }
    })
    return {
      id,
      name: channel.name,
      desc: channel.desc,
      joined: channel.joined,
      user: channel.user
    }
  }
  const getVideo = async (db, id) => {
    const video = await db.Video.findOne({
      where: {
        id
      }
    })
    return {
      id,
      title: video.title,
      desc: video.desc,
      likes: video.likes,
      dislikes: video.dislikes,
      uploaded: video.uploaded,
      targetAudience: video.targetAudience,
      channel: video.channel
    }
  }
  return { getChannel, getVideo }
}
