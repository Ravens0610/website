const { Op } = require('sequelize').Sequelize

const PAGE_SIZE = 10

module.exports = ({ Channel, Video }) => {
  const search = async (query, page = 0) => {
    const { rows, count } = await Video.findAndCountAll({
      offset: (page + 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      where: {
        title: {
          [Op.like]: `%${query}%`
        }
      },
      include: [{ model: Channel }]
    })
    return {
      videos: rows,
      total: count,
      pages: Math.ceil(count / PAGE_SIZE)
    }
  }
  return { search }
}
