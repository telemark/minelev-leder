'use strict'

const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const myClasses = yar.get('myClasses') || []

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  reply.view('index', viewOptions)
}

module.exports.getHelppage = (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const myClasses = yar.get('myClasses') || []
  const viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  reply.view('help', viewOptions)
}
