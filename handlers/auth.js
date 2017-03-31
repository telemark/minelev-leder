'use strict'

const logger = require('../lib/logger')
const verifySigninJwt = require('../lib/verify-signin-jwt')

module.exports.doSignIn = async (request, reply) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar
  try {
    const user = await verifySigninJwt(token)
    logger(['auth', 'user verified', user.userName])

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
    logger(['auth', 'error', error])
    reply(error)
  }
}

module.exports.doSignOut = (request, reply) => {
  request.cookieAuth.clear()
  reply.redirect('/')
}
