'use strict'

const resolveClasses = require('../lib/resolve-classes')
const createViewOptions = require('../lib/create-view-options')

module.exports.getClasses = async (request, reply) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  let myClasses = yar.get('myClasses') || []

  if (myClasses.length === 0) {
    const selectedClasses = await resolveClasses({id: userId, schools: request.params.schoolId})
    const mySchoolIds = mySchools.map(school => school.id)
    myClasses = selectedClasses.filter(c => mySchoolIds.includes(c.schoolId))
    yar.set('myClasses', myClasses)
  }

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  reply.view('classes', viewOptions)
}
