'use strict'

const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin})

  reply.view('index', viewOptions)
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || false
  const viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin})

  reply.view('help', viewOptions)
}
