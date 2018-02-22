const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://api.uptimerobot.com/v2'

const options = {
  method: 'POST',
  json: true
}

const getMWindows = (credentials) => {
  options.uri = `${apiBaseUrl}/getMWindows`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const getPSPs = (credentials) => {
  options.uri = `${apiBaseUrl}/getPSPs`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const getAlertContacts = (credentials) => {
  options.uri = `${apiBaseUrl}/getAlertContacts`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const getMonitors = (credentials) => {
  options.uri = `${apiBaseUrl}/getMonitors`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const getAccountDetails = (credentials) => {
  options.uri = `${apiBaseUrl}/getAccountDetails`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const write = (data) => {
  let columns = Object.keys(data)
  let values = Object.values(data)
  var writer = csvWriter({ headers: columns})
  writer.pipe(fs.createWriteStream('out.csv'))
  writer.write(values)
  writer.end()
}

module.exports = {
  export: function(credentials) {
    getMonitors(credentials)
    .then((data) => {
      write(data.monitors)
    })
    getAccountDetails(credentials) {
      .then((data) => {
        write(data.AccountDetails)
      })
    }
    getMWindows(credentials) {
      .then((data) => {
        write(data.mwindows)
      })
    }
    getAlertContacts(credentials) {
      .then((data) => {
        write(data.alert_contacts)
      })
    }
    getPSPs(credentials) {
      .then((data) => {
        write(data.psps)
      })
    }
  }
