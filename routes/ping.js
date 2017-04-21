'use strict'

const handlers = require('../handlers/ping')

module.exports = [
  {
    method: 'GET',
    path: '/ping',
    handler: handlers.ping,
    config: {
      auth: false,
      description: 'Ping me'
    }
  }
]
