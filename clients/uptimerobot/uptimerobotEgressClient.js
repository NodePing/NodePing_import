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

const getAlertContacts = (credentials) => {
  let options = {
    uri: `${apiBaseUrl}/getAlertContacts`,
    method: 'POST',
    body: {
      api_key: credentials.token
    },
    json: true
  }
  return rp(options)
  .then((contacts) => {
    return utils.mapContacts(contacts)
  })
}

module.exports = {
  getDataMap: function(credentials) {
    return getMonitors(credentials)
    .then((monitorResults) => {
      const checks = utils.mapMonitorsToChecks(monitorResults.monitors)
      return getAlertContacts(credentials)
      .then((contactMap) => {
        const mappedChecks = utils.mapContactsToChecks(checks, contactMap)
        dataMap = {
          contactMap,
          checks
        }
        return dataMap
      })
    })
  }
}
