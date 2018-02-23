const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://app.statuscake.com/API'

const options = {
  method: 'GET',
  json:true
}

const getContactGroups = () => {
  options.uri = `${apiBaseUrl}/ContactGroups`
  return rp(options)
}

const writeContacts = (data) => {
  const rows = []
  let columnNames
  let values
  data.forEach((contact) => {
    columnNames = Object.keys(contact)
    values = Object.values(contact)
    rows.push(values)
  })
  write(columnNames, rows, 'contacts')
}

const getMaintenanceWindows = () => {
  options.uri = `${apiBaseUrl}/Maintenance`
  return rp(options)
}

const getPageSpeedTests = () => {
  options.uri = `${apiBaseUrl}/PageSpeed`
  return rp(options)
}

const getPageSpeedHistory = () => {
  options.uri = `${apiBaseUrl}/PageSpeed/History`
  return rp(options)
}

const getPerformanceData = () => {
  options.uri = `${apiBaseUrl}/Tests/Checks`
  return rp(options)
}

const getPeriodData = () => {
  options.uri = `${apiBaseUrl}/Tests/Periods`
  return rp(options)
}

const getSSLTests = () => {
  options.uri = `${apiBaseUrl}/SSL`
  return rp(options)
}

const getAllTests = () => {
  options.uri = `${apiBaseUrl}/Tests`
  return rp(options)
}

const writeTests = (data) => {
  const rows = []
  let columnNames
  let values
  data.forEach((test) => {
    columnNames = Object.keys(test)
    values = Object.values(test)
    rows.push(values)
  })
  write(columnNames, rows, 'testMetas')
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
    options.headers = {
        'API': credentials.token,
        'Username': credentials.user
    }
    getContactGroups()
    .then((data) => {
      writeContacts(data)
    })
    getAllTests()
    .then((data) => {
      writeTests(data)
    })

  }
}
