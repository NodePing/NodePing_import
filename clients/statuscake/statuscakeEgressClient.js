const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./SC_utils.js')

const apiBaseUrl = 'https://app.statuscake.com/API/'

const getTests = (credentials) => {
  const tests = []
  let options = {
    uri: `${apiBaseUrl}Tests/`,
    headers: {
        'API': credentials.token,
        'Username': credentials.user
    },
    json: true
  }
  return rp(options)
}

const getContactGroups = (credentials) => {
  let options = {
    uri: `${apiBaseUrl}ContactGroups/`,
    headers: {
        'API': credentials.token,
        'Username': credentials.user
    },
    json: true
  }
  return rp(options)
  .then((results) => {
    return utils.mapContactsAndGroups(results)
  })
}

module.exports = {
  getDataMap: function(credentials) {
    return getTests(credentials)
    .then((tests) => {
      const checks = utils.mapTestsToChecks(tests)
      return getContactGroups(credentials)
      .then((contactMap) => {
        dataMap = {
          contactMap: contactMap,
          checks: checks
        }
        return dataMap
      })
    })
  }
}
