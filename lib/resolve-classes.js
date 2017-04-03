'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')

module.exports = async options => {
  const token = generateSystemJwt(options.userId)

  axios.defaults.headers.common['Authorization'] = token

  const results = await axios(`${config.LOGS_SERVICE_URL}/classes/${options.schoolId}`)

  const classes = results.data

  classes.sort()

  const list = classes.map(c => {
    const splitted = c.split(':')
    return Object.assign({id: c, schoolId: splitted[0], group: splitted[1]})
  })

  return list
}
