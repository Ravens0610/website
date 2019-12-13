const sendResponse = (res, data, message, type) =>
  res.status(type === 'error' ? 500 : 200).json({
    data,
    message: message === null ? null : message.toString(),
    type
  })

module.exports = {
  sendResponse,
  sendError: (res, message) => sendResponse(res, null, message, 'error')
}
