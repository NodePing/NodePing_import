const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://api.uptimerobot.com/v2'

const options = {
  method: 'POST',
  json: true
}

const getMonitors = (credentials) => {
  options.uri = `${apiBaseUrl}/getMonitors`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const writeMonitors = (data) => {
  const rows = []
  let columnNames
  let values
  data.monitors.forEach((monitor) => {
    columnNames = Object.keys(monitor)
    values = Object.values(monitor)
    rows.push(values)
  })
  write(columnNames, rows, 'monitors')
}

const getMWindows = (credentials) => {
  options.uri = `${apiBaseUrl}/getMWindows`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const writeMWindows = (data) => {
  const rows = []
  let columnNames
  let values
  data.mwindows.forEach((mwindow) => {
    columnNames = Object.keys(mwindow)
    values = Object.values(mwindow)
    rows.push(values)
  })
  write(columnNames, rows, 'mwindows')
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

const writeContacts = (data) => {
  const rows = []
  let columnNames
  let values
  data.alert_contacts.forEach((contact) => {
    columnNames = Object.keys(contact)
    values = Object.values(contact)
    rows.push(values)
  })
  write(columnNames, rows, 'contacts')
}

const getAccountDetails = (credentials) => {
  options.uri = `${apiBaseUrl}/getAccountDetails`
  options.body = {
    api_key: credentials.token
  }
  return rp(options)
}

const writeAccountDetails = (data) => {
  const rows = []
  const account = data.account
  const columnNames = Object.keys(account)
  const values = Object.values(account)
  rows.push(values)

  write(columnNames, rows, 'accountDetails')
}

const write = (columnNames, rows, entityName) => {
  var writer = csvWriter({ headers: columnNames})
  writer.pipe(fs.createWriteStream(`${entityName}.csv`))
  rows.forEach((row) => {
    writer.write(row)
  })
  writer.end()
}



module.exports = {
  export: function(credentials) {
    getMonitors(credentials)
    .then((data) => {
      writeMonitors(data)
    })
    getMWindows(credentials)
    .then((data) => {
      writeMWindows(data)
    })
    getAlertContacts(credentials)
    .then((data) => {
      writeContacts(data)
    })
    getAccountDetails(credentials)
    .then((data) => {
      writeAccountDetails(data)
    })
  }
}
