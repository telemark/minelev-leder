const pkg = require('../package.json')

module.exports.ping = (request, reply) => {
  const result = {
    name: pkg.name,
    version: pkg.version,
    uptime: process.uptime()
  }
  reply(result)
}
