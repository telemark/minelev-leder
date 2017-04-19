'use strict'

const axios = require('axios')
const checkAccess = require('./check-access')
const resolveSchools = require('./resolve-schools')
const logger = require('./logger')
const config = require('../config')

module.exports = token => {
  return new Promise((resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = token
    axios.get(config.USER_LOOKUP_URL)
      .then(result => {
        const user = result.data
        const userId = user.sAMAccountName || user.uid || ''
        const mySchools = resolveSchools(user)

        const data = {
          userName: user.displayName || user.cn || '',
          userId: userId,
          company: user.company || config.api.defaults.company,
          mail: user.mail || config.api.defaults.mail,
          isAdmin: checkAccess(user),
          mySchools: mySchools
        }

        logger('info', ['lookup-user', 'external data retrieved', 'userId', data.userId])
        resolve(user)
      })
      .catch(error => {
        logger('error', ['lookup-user', 'lookup failed', error])
        reject(error)
      })
  })
}
