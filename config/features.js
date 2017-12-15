const config = require('./index')

module.exports = {
  useWarnings: config.FEATURE_USE_WARNINGS || false,
  useSamtaler: config.FEATURE_USE_SAMTALER || false
}
