const axios = require('axios')
const config = require('../config')
const logger = require('../lib/logger')

module.exports.checkSystems = async (request, h) => {
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
    return h.response(systems.map((site, index) => Object.assign(site, { result: results[index] })))
  } catch (error) {
    logger('error', ['systems', 'checkSystems', error])
    return h.response(error)
  }
}
