const rp = require('request-promise')
const Promise = require('bluebird')

const apiBaseUrl = 'https://app.statuscake.com/API'

const options = {
  method: 'GET',
  json:true
}


const getContactGroups = (credentials) => {
  options.uri = `${apiBaseUrl}/ContactGroups`
  return rp(options)
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

const getTestDetails = (credentials, testID) => {
  options.uri = `${apiBaseUrl}/Details/?TestID=${testID}`
  return rp(options)
}



module.exports = {
  exportAllData: function(credentials) {
    
  }
}
