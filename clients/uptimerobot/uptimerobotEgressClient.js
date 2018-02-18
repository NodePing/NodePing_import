const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./UR_utils.js')

const apiBaseUrl = 'https://api.uptimerobot.com/v2'


const getMonitors = (credentials) => {
  let options = {
    uri: `${apiBaseUrl}/getMonitors`,
    method: 'POST',
    body: {
      api_key: credentials.token
    },
    json: true
  }
  return rp(options)
}

module.exports = {
  getDataMap: function(credentials) {
    return getMonitors(credentials)
    .then((monitors) => {
      const checks = utils.mapMonitorsToChecks(monitors)
    })
  }
}
