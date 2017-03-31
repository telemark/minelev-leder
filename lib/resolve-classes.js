'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')

module.exports = async options => {
  const token = generateSystemJwt(options.userId)

  axios.defaults.headers.common['Authorization'] = token

  const jobs = options.schools.map(school => axios(`${config.LOGS_SERVICE_URL}/classes/${school.id}`))

  const results = await Promise.all(jobs)

  const classes = results.reduce((a, b) => {
    const list = a.concat(b.data)
    return list
  }, [])

  classes.sort()

  const list = classes.map(c => {
    const splitted = c.split(':')
    return Object.assign({id: c, school: splitted[0], group: splitted[1]})
  })

  return list
}
