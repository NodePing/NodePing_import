const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://app.statuscake.com/API'

const options = {
  method: 'GET',
  json:true
}

const logError = (error, endpointName) => {
  console.log(`Error when checking for ${endpointName}: ${err.error.message}`)
}

const getContactGroups = () => {
  options.uri = `${apiBaseUrl}/ContactGroups`
  return rp(options)
  .catch((err) => {
    logError(err, 'contactGroups')
  })
}

const getSSLTests = () => {
  options.uri = `${apiBaseUrl}/SSL`
  return rp(options)
  .catch((err) => {
    logError(err, 'SSLTests')
  })
}

const writeSSLTests = (data) => {
  const rows = []
  let columnNames
  let values
  data.forEach((SSLTest) => {
    columnNames = Object.keys(SSLTest)
    values = Object.values(SSLTest)
    rows.push(values)
  })
  write(columnNames, rows, 'SSLTests')
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
  .catch((err) => {
    logError(err, 'MaintenanceWindows')
  })
}

const writeMaintenanceWindows = (maintenaceWindowData) => {
  if (maintenaceWindowData) {
    const rows = []
    let columnNames
    let values
    data.forEach((maintenaceWindowData) => {
      columnNames = Object.keys(maintenaceWindowData)
      values = Object.values(maintenaceWindowData)
      rows.push(values)
    })
    write(columnNames, rows, 'maintenaceWindows')
  }
}

const getPageSpeedTests = () => {
  options.uri = `${apiBaseUrl}/Pagespeed/`
  return rp(options)
  .catch((err) => {
    logError(err, 'PageSpeedTests')
  })
}

const getPageSpeedHistory = (pageTestID) => {
  options.uri = `${apiBaseUrl}/Pagespeed/History?id=${pageTestID}`
  return rp(options)
  .catch((err) => {
    logError(err, 'PageSpeedHistory')
  })
}

const writePageSpeedTests = (pageSpeedData) => {
  const pageSpeedTests = pageSpeedData.data
  return Promise.map(pageSpeedTests, (pageSpeedTest) => {
    getPageSpeedHistory(pageSpeedTest.ID)
    .then((pageSpeedHistory) => {
      writePageSpeedData(pageSpeedTest, pageSpeedHistory)
    })
  })
}

const writePageSpeedData = (pageSpeedTest, pageSpeedHistory) => {
  const columnNames = [
    'ID', 'title', 'url', 'location', 'location_ISO', 'ContactGroups',
    'loadtime_ms_min', 'loadtime_ms_max', 'loadtime_ms_avg',
    'requests_min', 'requests_max', 'requests_avg',
    'filesize_kb_min', 'filesize_kb_max', 'filesize_kb_avg'
  ]

  const history = pageSpeedHistory.data.aggregated
  const ID = pageSpeedTest.ID
  const title = pageSpeedTest.Title
  const url = pageSpeedTest.URL
  const location = pageSpeedTest.Location
  const Location_ISO = pageSpeedTest.Location_ISO
  const ContactGroups = pageSpeedTest.ContactGroups

  const loadtime_ms_min = history.loadtime_ms.min
  const loadtime_ms_max = history.loadtime_ms.max
  const loadtime_ms_avg = history.loadtime_ms.avg

  const requests_min = history.requests.min
  const requests_max = history.requests.max
  const requests_avg = history.requests.avg

  const filesize_kb_min = history.filesize_kb.min
  const filesize_kb_max = history.filesize_kb.max
  const filesize_kb_avg = history.filesize_kb.avg

  const values = [
    ID, title, url, location, Location_ISO, ContactGroups,
    loadtime_ms_min, loadtime_ms_max, loadtime_ms_avg,
    requests_min, requests_max, requests_avg,
    filesize_kb_min, filesize_kb_max, filesize_kb_avg
  ]

  write(columnNames, [values], 'pageSpeedHistory')
}

const getPerformanceData = () => {
  options.uri = `${apiBaseUrl}/Tests/Checks`
  return rp(options)
  .catch((err) => {
    logError(err, 'PerformanceData')
  })
}

const getPeriodData = () => {
  options.uri = `${apiBaseUrl}/Tests/Periods`
  return rp(options)
  .catch((err) => {
    logError(err, 'PeriodData')
  })
}

const getAllTests = () => {
  options.uri = `${apiBaseUrl}/Tests`
  return rp(options)
  .catch((err) => {
    logError(err, 'Tests')
  })
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
      .then((contactData) => writeContacts(contactData))
    getAllTests()
      .then((testData) => writeTests(testData))
    getSSLTests()
      .then((SSLTestData) => writeSSLTests(SSLTestData))
    getPageSpeedTests()
      .then((pageSpeedTests) => writePageSpeedTests(pageSpeedTests))
    getMaintenanceWindows()
      .then((maintenanceWindows) => writeMaintenanceWindows(maintenanceWindows))
  }
}
