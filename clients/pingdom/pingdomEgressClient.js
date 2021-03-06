const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./PD_utils.js')

const apiBaseUrl = 'https://api.pingdom.com/api/2.1'

const options = {
  method: 'GET',
  json: true
}

const logError = (error, endpointName) => {
  if (error.error.error.statuscode === 401) {
    console.log('Invalid Pingdom credentials, please verify credentials.js')
    process.exit()
  } else {
    console.log(`Error when invoking ${endpointName}: ${error.error.error.errormessage}`)
    process.exit()
  }
}

const authHeader = (credentials) => {
  let auth = "Basic " + new Buffer(credentials.user + ":" + credentials.pwd).toString("base64");
  return {
    'App-Key': credentials.token,
    Authorization : auth
  }
}

const getCheck = (checkID) => {
  options.uri = `${apiBaseUrl}/checks/${checkID}`
  return rp(options)
  .catch((err) => {
    logError(err, `checks/${checkID}`)
  })
}

const getChecks = () => {
  options.uri = `${apiBaseUrl}/checks`
  return rp(options)
  .then((response) => {
    return Promise.map(response.checks, (check) => {
      return getCheck(check.id)
    })
  })
  .catch((err) => {
    logError(err, 'checks')
  })
}

const getUserTeams = () => {
  options.uri = `${apiBaseUrl}/teams`
  return rp(options)
  .catch((err) => {
    logError(err, 'teams')
  })
}

const getUsers = () => {
  options.uri = `${apiBaseUrl}/users`
  return rp(options)
  .catch((err) => {
    logError(err, 'users')
  })
}

const getUsersAndTeams = () => {
  return getUsers()
  .then((users) => {
    return getUserTeams()
    .then((userTeams) => {
      return {
        userTeams,
        users
      }
    })
  })
}

module.exports = {
  getDataMap: function(credentials) {
    options.headers = authHeader(credentials)
    return getChecks()
    .then((checks) => {
      const NPChecks = utils.mapPDChecksToNPChecks(checks)
      return getUsersAndTeams()
      .then((usersAndTeams) => {
        const contactMap = utils.mapUsersAndTeams(usersAndTeams)
        dataMap = {
          contactMap: contactMap,
          checks: NPChecks
        }
        return dataMap
      })
    })
  }
}
