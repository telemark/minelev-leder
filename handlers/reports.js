'use strict'

const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackWarningsReport = require('../lib/repack-warnings-report')
const repackFollowupsReport = require('../lib/repack-followups-report')
const createViewOptions = require('../lib/create-view-options')

module.exports.getWarningsSchoolReport = async (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const userId = request.auth.credentials.data.userId
  const schoolId = request.params.schoolID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    schoolId: schoolId
  }
  axios.defaults.headers.common['Authorization'] = token

  const results = await axios.post(url, query)

  const report = mySchools.map(line => line.id).includes(schoolId) ? repackWarningsReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin, report: report })

  reply.view('report-warnings', viewOptions)
}

module.exports.getFollowupsSchoolReport = async (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const userId = request.auth.credentials.data.userId
  const schoolId = request.params.schoolID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    schoolId: schoolId
  }
  axios.defaults.headers.common['Authorization'] = token

  const results = await axios.post(url, query)

  const report = mySchools.map(line => line.id).includes(schoolId) ? repackFollowupsReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin, report: report })

  reply.view('report-followups', viewOptions)
}

module.exports.showReportsPage = async (request, reply) => {
  const yar = request.yar
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin})

  reply.view('index', viewOptions)
}
