const axios = require('axios')
const config = require('../config')
const generateSystemJwt = require('../lib/generate-system-jwt')
const repackWarningsReport = require('../lib/repack-warnings-report')
const repackFollowupsReport = require('../lib/repack-followups-report')
const repackYFFReport = require('../lib/repack-yff-report')
const createViewOptions = require('../lib/create-view-options')
const logger = require('../lib/logger')

module.exports.getWarningsSchoolReport = async (request, h) => {
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const userId = request.auth.credentials.data.userId
  const schoolId = request.params.schoolID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    schoolId: schoolId,
    documentType: 'varsel'
  }
  axios.defaults.headers.common.Authorization = token

  const results = await axios.post(url, query)

  const report = mySchools.map(line => line.id).includes(schoolId) ? repackWarningsReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin, report: report, schoolId })

  return h.view('report-warnings', viewOptions)
}

module.exports.getWarningsClassReport = async (request, h) => {
  const yar = request.yar
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = yar.get('myClasses') || []
  const userId = request.auth.credentials.data.userId
  const classId = request.params.groupID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    studentMainGroupName: classId,
    documentType: 'varsel'
  }

  axios.defaults.headers.common.Authorization = token

  logger('info', ['reports', 'getWarningsClassReport', 'class', classId, 'userId', userId])

  const results = await axios.post(url, query)

  const report = myClasses.map(line => line.id).includes(classId) ? repackWarningsReport(results.data) : []

  logger('info', ['reports', 'getWarningsClassReport', 'class', classId, 'userId', userId, 'reports', report.length])

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, report: report, classId })

  return h.view('report-warnings', viewOptions)
}

module.exports.getFollowupsSchoolReport = async (request, h) => {
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const userId = request.auth.credentials.data.userId
  const schoolId = request.params.schoolID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    schoolId: schoolId,
    documentType: 'samtale'
  }
  axios.defaults.headers.common.Authorization = token

  const results = await axios.post(url, query)

  const report = mySchools.map(line => line.id).includes(schoolId) ? repackFollowupsReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin, report: report })

  return h.view('report-followups', viewOptions)
}

module.exports.getFollowupsClassReport = async (request, h) => {
  const yar = request.yar
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = yar.get('myClasses') || []
  const userId = request.auth.credentials.data.userId
  const classId = request.params.groupID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    studentMainGroupName: classId,
    documentType: 'samtale'
  }
  axios.defaults.headers.common.Authorization = token

  const results = await axios.post(url, query)

  const report = myClasses.map(line => line.id).includes(classId) ? repackWarningsReport(results.data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, report: report, classId: classId })

  return h.view('report-followups', viewOptions)
}

module.exports.getYFFClassReport = async (request, h) => {
  const yar = request.yar
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = yar.get('myClasses') || []
  const userId = request.auth.credentials.data.userId
  const classId = request.params.groupID
  const token = generateSystemJwt(userId)
  const url = `${config.LOGS_SERVICE_URL}/logs/search`
  const query = {
    studentMainGroupName: classId,
    documentCategory: 'yff-lokalplan'
  }
  axios.defaults.headers.common.Authorization = token

  const { data } = await axios.post(url, query)

  const report = myClasses.map(line => line.id).includes(classId) ? repackYFFReport(data) : []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, students: report, classId: classId })
  return h.view('report-yff', viewOptions)
}

module.exports.showReportsPage = async (request, h) => {
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, isAdmin: isAdmin })

  return h.view('index', viewOptions)
}
