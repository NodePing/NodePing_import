const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./PD_utils.js')

const apiBaseUrl = 'https://api.pingdom.com/api/2.1'

const authHeader = (credentials) => {
  let auth = "Basic " + new Buffer(credentials.user + ":" + credentials.pwd).toString("base64");
  return {
    'App-Key': credentials.token,
    Authorization : auth
  }
}

const getCheck = (credentials, checkID) => {
  let options = {
    method: 'GET',
    headers: authHeader(credentials),
    uri: `${apiBaseUrl}/checks/${checkID}`,
    json: true
  }
  return rp(options)
}

const getChecks = (credentials) => {
    let options = {
      method: 'GET',
      headers: authHeader(credentials),
      uri: `${apiBaseUrl}/checks`,
      json: true
    }
    return rp(options)
    .then((response) => {
      return Promise.map(response.checks, (check) => {
        return getCheck(credentials, check.id)
      })
    })
}

const getUserTeams = (credentials) => {
  let options = {
    method: 'GET',
    headers: authHeader(credentials),
    uri: `${apiBaseUrl}/teams`,
    json: true
  }
  return rp(options)
}

const getUsers = (credentials) => {
  let options = {
    method: 'GET',
    headers: authHeader(credentials),
    uri: `${apiBaseUrl}/users`,
    json: true
  }
  return rp(options)
}

const getUsersAndTeams = (credentials) => {
  return getUsers(credentials)
  .then((users) => {
    return getUserTeams(credentials)
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
    return getChecks(credentials)
    .then((checks) => {
      const NPChecks = utils.mapPDChecksToNPChecks(checks)
      return getUsersAndTeams(credentials)
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
