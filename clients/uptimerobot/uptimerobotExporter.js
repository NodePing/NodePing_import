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

const write = (columnNames, rows, entityName) => {
  var writer = csvWriter({ headers: columnNames})
  writer.pipe(fs.createWriteStream(`${entityName}.csv`))
  rows.forEach((row) => {
    writer.write(row)
  })
  writer.end()
}

const transformMonitorData = (data) => {
  rows = []
  data.monitors.forEach((monitor) => {
    columnNames = Object.keys(monitor)
    values = Object.values(monitor)
    rows.push(values)
  })
  write(columnNames, rows, 'monitors')
}

module.exports = {
  export: function(credentials) {
    getMonitors(credentials)
    .then((data) => {
      monitors = transformMonitorData(data)
    })
  }
}
