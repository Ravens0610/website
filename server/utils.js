class HTTPError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.status = status
  }
}

const sendResponse = (res, data, message, type) =>
  res.status(200).json({
    data,
    message: message === null ? null : message.toString(),
    type
  })

module.exports = {
  getUserToken: (req) => {
    if (req.headers['x-access-token']) return req.headers['x-access-token']
    if (req.headers.authorization)
      return req.headers.authorization.split(' ')[1]
  },
  HTTPError,
  sendResponse,
  sendError: (res, err) => {
    const prod = process.env.NODE_ENV === 'production'
    const custom = err instanceof HTTPError
    const status = custom ? err.status : 500
    const message = custom
      ? err.message
      : prod
      ? `An error occured: ${err.message}`
      : err.message
    const stack = prod ? '' : err.stack
    res.status(status).json({ error: message, stack })
  }
}
