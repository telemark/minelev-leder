'use strict'

const verifySigninJwt = require('../lib/verify-signin-jwt')
const logger = require('../lib/logger')

module.exports.doSignIn = async (request, reply) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar
  try {
    const user = await verifySigninJwt(token)
    logger('info', ['auth', 'doSignIn', 'user verified', 'userId', user.userId])

    yar.set('isAdmin', user.isAdmin)
    yar.set('mySchools', user.mySchools)
    yar.set('myClasses', [])

    request.cookieAuth.set({data: user, token: token})

    if (nextPath && nextPath.length > 0) {
      reply.redirect(nextPath)
    } else {
      reply.redirect('/')
    }
  } catch (error) {
    logger('error', ['auth', 'doSignIn', 'error', error])
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
