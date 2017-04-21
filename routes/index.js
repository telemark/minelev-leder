'use strict'

const handlers = require('../handlers')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: handlers.getFrontpage,
    config: {
      description: 'Show the frontpage'
    }
  },
  {
    method: 'GET',
    path: '/help',
    handler: handlers.getHelppage,
    config: {
      description: 'Show the helppage'
    }
  }
]
