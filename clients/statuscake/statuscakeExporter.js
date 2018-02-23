const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://app.statuscake.com/API'

const options = {
  method: 'GET',
  json:true
}


const getContactGroups = (credentials) => {
  options.uri = `${apiBaseUrl}/ContactGroups`
  options.headers = {
      'API': credentials.token,
      'Username': credentials.user
  }
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

const getMaintenanceWindows = (credentials) => {
  options.uri = `${apiBaseUrl}/Maintenance`
  return rp(options)
}

const getPageSpeedTests = (credentials) => {
  options.uri = `${apiBaseUrl}/PageSpeed`
  return rp(options)
}

const getPageSpeedHistory = (credentials) => {
  options.uri = `${apiBaseUrl}/PageSpeed/History`
  return rp(options)
}

const getPerformanceData = (credentials) => {
  options.uri = `${apiBaseUrl}/Tests/Checks`
  return rp(options)
}

const getPeriodData = (credentials) => {
  options.uri = `${apiBaseUrl}/Tests/Periods`
  return rp(options)
}

const getSSLTests = (credentials) => {
  options.uri = `${apiBaseUrl}/SSL`
  return rp(options)
}

const getAllTests = (credentials) => {
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
    getContactGroups(credentials)
    .then((data) => {
      writeContacts(data)
    })
    getAllTests(credentials)
    .then((data) => {
      writeTests(data)
    })
    
  }
}
