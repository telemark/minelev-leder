const config = require('./index')

module.exports = {
  useWarnings: config.FEATURE_USE_WARNINGS || false,
  useYFF: config.FEATURE_USE_YFF || false,
  useSamtaler: config.FEATURE_USE_SAMTALER || false
}
