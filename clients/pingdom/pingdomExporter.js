const rp = require('request-promise')
const Promise = require('bluebird')

const apiBaseUrl = 'https://api.pingdom.com/api/2.1'

const options = {
  method: 'GET',
  json: true
}

const getTeams = (credentials) => {
  options.uri = `${apiBaseUrl}/teams`
	return rp(options)
}

const getActions = (credentials) => {
  options.uri = `${apiBaseUrl}`
	return rp(options)
}

const getChecks = (credentials) => {
  options.uri = `${apiBaseUrl}/checks`
	return rp(options)
}

const getCredits = (credentials) => {
  options.uri = `${apiBaseUrl}/credits`
	return rp(options)
}

const getMaintenanceWindows = (credentials) => {
  options.uri = `${apiBaseUrl}/maintenance`
	return rp(options)
}

const getProbes = (credentials) => {
  options.uri = `${apiBaseUrl}/probes`
	return rp(options)
}

const getReferences = (credentials) => {
  options.uri = `${apiBaseUrl}/reference`
	return rp(options)
}

const getEmailReports = (credentials) => {
  options.uri = `${apiBaseUrl}/reports.email`
	return rp(options)
}

const getPublicReports = (credentials) => {
  options.uri = `${apiBaseUrl}/reports.public`
	return rp(options)
}

const getSharedReports = (credentials) => {
  options.uri = `${apiBaseUrl}/reports.shared`
	return rp(options)
}

const getServerTime = (credentials) => {
  options.uri = `${apiBaseUrl}/servertime`
	return rp(options)
}

const getSettings = (credentials) => {
  options.uri = `${apiBaseUrl}/settings`
	return rp(options)
}

const getCheckResults = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/results/${checkID}`
	return rp(options)
}

const getSummaryAverage = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/summary.average/${checkID}`
	return rp(options)
}

const getSummaryHourly = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/summary.hoursofday/${checkID}`
	return rp(options)
}

const getOutages = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/summary.outage/${checkID}`
	return rp(options)
}

const getPerformanceSummary = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/summary.performance/${checkID}`
	return rp(options)
}

const getProbeSummary = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/summary.probes/${checkID}`
	return rp(options)
}

const getAnalysis = (credentials, checkID) => {
  options.uri = `${apiBaseUrl}/analysis/${checkid}`
	return rp(options)
}
