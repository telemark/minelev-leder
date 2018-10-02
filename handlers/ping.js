const pkg = require('../package.json')

module.exports.ping = async (request, h) => {
  const result = {
    name: pkg.name,
    version: pkg.version,
    uptime: process.uptime()
  }
  return h.response(result)
}
