const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./SC_utils.js')

const apiBaseUrl = 'https://app.statuscake.com/API/'

const options = {
  json: true
}

const getTests = () => {
  options.uri = `${apiBaseUrl}Tests/`
  return rp(options)
}

const getSSL = () => {
  options.uri = `${apiBaseUrl}SSL`
  return rp(options)
}

const getContactGroups = (credentials) => {
  options.uri = `${apiBaseUrl}ContactGroups/`
  return rp(options)
  .then((results) => {
    return utils.mapContactsAndGroups(results)
  })
}

module.exports = {
  getDataMap: function(credentials) {
    options.headers = {
      'API': credentials.token,
      'Username': credentials.user
    }
    return getTests()
    .then((tests) => {
      return getSSL()
      .then((SSLTests) => {
        const checks = utils.mapTestsToChecks(tests, SSLTests)
        return getContactGroups()
        .then((contactMap) => {
          dataMap = {
            contactMap: contactMap,
            checks: checks
          }
          return dataMap
        })
      })


    })
  }
}
