'use strict'

const axios = require('axios')
const config = require('../config')

module.exports.checkSystems = async (request, reply) => {
  const systems = [
    {
      id: 'logs',
      url: `${config.LOGS_SERVICE_URL}/ping`
    },
    {
      id: 'auth',
      url: `${config.AUTH_SERVICE_URL}/ping`
    }
  ]

  const jobs = systems.map(site => axios(site.url))

  try {
    const checks = await Promise.all(jobs)
    const results = checks.map(check => check.data)
    reply(systems.map((site, index) => Object.assign(site, {result: results[index]})))
  } catch (error) {
    console.error(error)
    reply(error)
  }
}
