const Hapi = require('@hapi/hapi')
const createViewOptions = require('./lib/create-view-options')
const routes = require('./routes')
const authRoutes = require('./routes/auth')
const statsRoutes = require('./routes/stats')
const reportsRoutes = require('./routes/reports')
const classesRoutes = require('./routes/classes')
const systemsRoutes = require('./routes/systems')
const pingRoutes = require('./routes/ping')
const config = require('./config')
const logger = require('./lib/logger')

// Create a server with a host and port
const server = Hapi.server({
  port: config.WEB_SERVER_PORT
})

// Add the routes
server.route(routes)
server.route(authRoutes)
server.route(statsRoutes)
server.route(reportsRoutes)
server.route(classesRoutes)
server.route(systemsRoutes)
server.route(pingRoutes)

const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.YAR_SECRET,
    isSecure: process.env.NODE_ENV !== 'development',
    isSameSite: 'Lax'
  }
}

const plugins = [
  { plugin: require('hapi-auth-cookie') },
  { plugin: require('@hapi/vision') },
  { plugin: require('@hapi/inert') },
  { plugin: require('yar'), options: yarOptions }
]

// Start the server
async function start () {
  await server.register(plugins)

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    },
    options: {
      auth: false
    }
  })

  server.ext('onPreResponse', (request, reply) => {
    const response = request.response

    if (response && response.isBoom) {
      const err = request.response
      const errName = err.output.payload.error
      const statusCode = err.output.payload.statusCode

      logger('info', ['server', 'returning error page', server.info.uri, statusCode, errName])

      const viewOptions = createViewOptions({ statusCode, errName }) || { statusCode, errName }
      return reply.view('error', viewOptions).code(statusCode)
    }

    return reply.continue
  })

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates',
    layout: true,
    layoutPath: 'templates/layouts',
    helpersPath: 'templates/helpers',
    partialsPath: 'templates/partials'
  })

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'web-minelev-leder-session',
      password: config.COOKIE_SECRET,
      isSecure: process.env.NODE_ENV !== 'development',
      isSameSite: 'Lax'
    },
    redirectTo: `${config.AUTH_SERVICE_URL}/login?origin=${config.ORIGIN_URL}`,
    appendNext: 'nextPath'
  })

  server.auth.default('session')

  await server.start()
  logger('info', ['server', 'Server running', server.info.uri])
}

start().catch(error => {
  logger('error', ['server', error])
})
