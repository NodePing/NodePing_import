const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./SC_utils.js')

const apiBaseUrl = 'https://app.statuscake.com/API/'

const options = {
  json: true
}

const logError = (error, endpointName) => {
  console.log(Object.keys(error.error))
  if (error.error.ErrNo === 0) {
    console.log('Invalid StatusCake credentials, please verify credentials.js')
    process.exit()
  } else {
    console.log(`Error when invoking ${endpointName}: ${error.error.Error}`)
    process.exit()
  }
}

const getTests = () => {
  options.uri = `${apiBaseUrl}Tests/`
  return rp(options)
  .catch((err) => {
    logError(err, 'Tests')
  })
}

const getSSL = () => {
  options.uri = `${apiBaseUrl}SSL`
  return rp(options)
  .catch((err) => {
    logError(err, 'SSL')
  })
}

const getContactGroups = (credentials) => {
  options.uri = `${apiBaseUrl}ContactGroups/`
  return rp(options)
  .then((results) => {
    return utils.mapContactsAndGroups(results)
  })
  .catch((err) => {
    logError(err, 'ContactGroups')
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
