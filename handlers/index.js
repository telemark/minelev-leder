const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = yar.get('myClasses') || []
  if (mySchools.length === 0) {
    logger('info', ['index', 'getFrontpage', 'no schools', 'userId', userId])
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin })

  return h.view('index', viewOptions)
}

module.exports.getHelppage = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools
  const myClasses = yar.get('myClasses') || []
  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin })

  logger('info', ['index', 'getHelppage', 'userId', userId])

  return h.view('help', viewOptions)
}
