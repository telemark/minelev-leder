const Hapi = require('hapi')
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
  { plugin: require('vision') },
  { plugin: require('inert') },
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
    password: config.COOKIE_SECRET,
    cookie: 'web-minelev-session',
    redirectTo: `${config.AUTH_SERVICE_URL}/login?origin=${config.ORIGIN_URL}`,
    appendNext: 'nextPath',
    isSecure: process.env.NODE_ENV !== 'development',
    isSameSite: 'Lax'
  })

  server.auth.default('session')

  await server.start()
  logger('info', ['server', 'Server running', server.info.uri])
}

start().catch(error => {
  logger('error', ['server', error])
})
