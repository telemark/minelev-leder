'use strict'

const routes = require('./routes')
const auth = require('./routes/auth')
const stats = require('./routes/stats')
const reports = require('./routes/reports')
const classes = require('./routes/classes')
const systems = require('./routes/systems')
const ping = require('./routes/ping')

exports.register = (server, options, next) => {
  server.route(routes)
  server.route(auth)
  server.route(stats)
  server.route(reports)
  server.route(classes)
  server.route(systems)
  server.route(ping)
  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
