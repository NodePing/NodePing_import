const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://api.uptimerobot.com/v2'

const options = {
  method: 'POST',
  json: true
}

const logError = (error, endpointName) => {
  console.log(`Error when checking for ${endpointName}: ${error.statusCode}`)
}

const getMonitors = () => {
  options.uri = `${apiBaseUrl}/getMonitors`
  return rp(options)
  .catch((err) => {
    logError(err, 'Monitors')
  })
}

const writeMonitors = (data) => {
  if (data) {
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
}

const getMWindows = () => {
  options.uri = `${apiBaseUrl}/getMWindows`
  return rp(options)
  .catch((err) => {
    logError(err, 'MaintenanceWindows')
  })
}

const writeMWindows = (data) => {
  if (data) {
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
}

const getPSPs = () => {
  options.uri = `${apiBaseUrl}/getPSPs`
  return rp(options)
  .catch((err) => {
    logError(err, 'PSPs')
  })
}

const writePSPs = (pspData) => {
  if (pspData) {
    const rows = []
    let columnNames
    let values
    pspData.psps.forEach((psp) => {
      columnNames = Object.keys(psp)
      values = Object.values(psp)
      rows.push(values)
    })
    write(columnNames, rows, 'psps')
  }
}

const getAlertContacts = () => {
  options.uri = `${apiBaseUrl}/getAlertContacts`
  return rp(options)
  .catch((err) => {
    logError(err, 'AlertContacts')
  })
}

const writeContacts = (data) => {
  if (data) {
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
}

const getAccountDetails = () => {
  options.uri = `${apiBaseUrl}/getAccountDetails`
  return rp(options)
  .catch((err) => {
    logError(err, 'AccountDetails')
  })
}

const writeAccountDetails = (data) => {
  if (data) {
    const rows = []
    const account = data.account
    const columnNames = Object.keys(account)
    const values = Object.values(account)
    rows.push(values)

    write(columnNames, rows, 'accountDetails')
  }
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
    options.body = {
      api_key: credentials.token
    }
    getMonitors()
    .then((monitorData) => writeMonitors(monitorData))
    getMWindows()
    .then((mWindowData) => writeMWindows(mWindowData))
    getAlertContacts()
    .then((contactsData) => writeContacts(contactsData))
    getAccountDetails()
    .then((accountData) => writeAccountDetails(accountData))
    getPSPs()
    .then((pspData) => writePSPs(pspData))
  }
}
