const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('./generate-system-jwt')
const logger = require('./logger')

module.exports = async options => {
  const token = generateSystemJwt(options.userId)

  axios.defaults.headers.common.Authorization = token

  try {
    const url = `${config.LOGS_SERVICE_URL}/classes/${options.schoolId}`
    logger('info', ['resolve-classes', url, 'userId', options.userId, 'start'])
    const { data } = await axios(url)

    data.sort()

    const list = data.map(c => {
      const splitted = c.split(':')
      return Object.assign({ id: c, schoolId: splitted[0], group: splitted[1] })
    })
    logger('info', ['resolve-classes', url, 'classes', list.length, 'userId', options.userId, 'success'])
    return list
  } catch (error) {
    logger('error', ['resolve-classes', 'schoolId', options.schoolId, 'userId', options.userId, error])
    return []
  }
}
