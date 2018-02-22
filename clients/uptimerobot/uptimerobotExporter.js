const rp = require('request-promise')
const Promise = require('bluebird')

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
