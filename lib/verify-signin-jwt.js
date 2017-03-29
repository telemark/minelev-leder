'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)
const axios = require('axios')
const checkAccess = require('./check-access')
const resolveSchools = require('./resolve-schools')

module.exports = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Missing required signin jwt'))
    } else {
      jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
        if (error) {
          console.error('JWT verification failed')
          console.error(error)
          reject(error)
        } else {
          const decrypted = encryptor.decrypt(decoded.data)
          const sessionUrl = `${config.SESSION_STORAGE_URL}/${decrypted.session}`
          axios.get(sessionUrl)
            .then(result => {
              const user = encryptor.decrypt(result.data.value)
              const data = {
                userName: user.displayName || user.cn || '',
                userId: user.sAMAccountName || user.uid || '',
                company: user.company || config.api.defaults.company,
                mail: user.mail || config.api.defaults.mail,
                isAdmin: checkAccess(),
                mySchools: resolveSchools()
              }
              console.log('External session retrieved')
              resolve(data)
            })
            .catch(error => {
              console.log(sessionUrl)
              console.log('Getting external session failed')
              console.error(error)
              reject(error)
            })
        }
      })
    }
  })
}
