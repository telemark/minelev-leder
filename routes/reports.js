'use strict'

const handlers = require('../handlers/reports')

module.exports = [
  {
    method: 'GET',
    path: '/reports/warnings/{schoolID}',
    handler: handlers.getWarningsSchoolReport,
    config: {
      description: 'Report warnings for a spesific school'
    }
  },
  {
    method: 'GET',
    path: '/reports/warnings/class/{groupID}',
    handler: handlers.getWarningsClassReport,
    config: {
      description: 'Report warnings for a spesific class'
    }
  },
  {
    method: 'GET',
    path: '/reports/followups/{schoolID}',
    handler: handlers.getFollowupsSchoolReport,
    config: {
      description: 'Report followups for a spesific school'
    }
  },
  {
    method: 'GET',
    path: '/reports/followups/class/{groupID}',
    handler: handlers.getFollowupsClassReport,
    config: {
      description: 'Report followups for a spesific class'
    }
  },
  {
    method: 'GET',
    path: '/reports/yff/class/{groupID}',
    handler: handlers.getYFFClassReport,
    config: {
      description: 'Report YFF for a spesific class'
    }
  },
  {
    method: 'GET',
    path: '/reports',
    handler: handlers.showReportsPage,
    config: {
      description: 'Show reports pages'
    }
  }
]
