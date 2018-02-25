const rp = require('request-promise')
const Promise = require('bluebird')
const csvWriter = require('csv-write-stream')
const fs = require('fs')

const apiBaseUrl = 'https://api.pingdom.com/api/2.1'

const options = {
  method: 'GET',
  json: true
}

const getTeams = () => {
  options.uri = `${apiBaseUrl}/teams`
	return rp(options)
}

const writeTeams = (teamData) => {
  const rows = []
  const columnNames = ['teamID', 'teamName', 'userID', 'userName', 'userEmail']
  let values, teamID, teamName, teamUsers, userID, userName, userEmail
  teamData.teams.forEach((team) => {
    teamID = team.id
    teamName = team.name
    teamUsers = team.users
    teamUsers.forEach((teamUser) => {
      userID = teamUser.id
      userName = teamUser.name
      userEmail = teamUser.email
      rows.push([teamID, teamName, userID, userName, userEmail])
    })
  })
  write(columnNames, rows, 'teams')
}

const getActions = () => {
  options.uri = `${apiBaseUrl}/actions`
	return rp(options)
}

const writeActions = (actionsData) => {
  //TODO:
  // Generate actions data to test with
  //console.log(actionsData)
}

const getChecks = () => {
  options.uri = `${apiBaseUrl}/checks`
	return rp(options)
}

const writeChecks = (checkData) => {
  const rows = []
  let columnNames
  let values
  checkData.checks.forEach((check) => {
    columnNames = Object.keys(check)
    values = Object.values(check)
    rows.push(values)
  })
  write(columnNames, rows, 'checks')
}

const getCredits = () => {
  options.uri = `${apiBaseUrl}/credits`
	return rp(options)
}

const writeCredits = (creditData) => {
  const credits = creditData.credits
  const rows = []
  const values = []
  const columnNames = []
  for (keyName in credits) {
    let value = credits[keyName]
    if (value) {
      columnNames.push(keyName)
      values.push(value)
    }
  }
  rows.push(values)
  write(columnNames, rows, 'credits')
}

const getMaintenanceWindows = () => {
  options.uri = `${apiBaseUrl}/maintenance`
	return rp(options)
}

const writeWindows = (windowsData) => {
  const rows = []
  let columnNames = ['WindowID', 'desc', 'from', 'to', 'recurrencytype', 'repeatevery', 'effectiveto', 'checkID']
  let id, desc, from, to, recurType, repeat, effectTo
  windowsData.maintenance.forEach((mWindow) => {
    id = mWindow.id
    desc = mWindow.description
    from = mWindow.from
    to = mWindow.to
    recurType = mWindow.recurrencetype
    repeat = mWindow.repeatevery
    effectTo = mWindow.effectiveto
    mWindow.checks.uptime.forEach((check) => {
      rows.push([id, desc, from, to, recurType, repeat, effectTo, check])
    })
  })
  write(columnNames, rows, 'MaintenanceWindows')
}

const getProbes = () => {
  options.uri = `${apiBaseUrl}/probes`
	return rp(options)
}

const writeProbes = (probeData) => {
  const rows = []
  let columnNames
  let values
  probeData.probes.forEach((probe) => {
    columnNames = Object.keys(probe)
    values = Object.values(probe)
    rows.push(values)
  })
  write(columnNames, rows, 'probes')
}

const getReferences = () => {
  options.uri = `${apiBaseUrl}/reference`
	return rp(options)
}

const getEmailReports = () => {
  options.uri = `${apiBaseUrl}/reports.email`
	return rp(options)
}

const writeEmailReports = (emailReportData) => {
  const rows = []
  let columnNames
  let values
  emailReportData.subscriptions.forEach((report) => {
    columnNames = Object.keys(report)
    values = Object.values(report)
    rows.push(values)
  })
  write(columnNames, rows, 'emailReports')
}

const getPublicReports = () => {
  options.uri = `${apiBaseUrl}/reports.public`
	return rp(options)
}

const writePublicReports = (publicReportData) => {
  const rows = []
  let columnNames
  let values
  publicReportData.public.forEach((report) => {
    columnNames = Object.keys(report)
    values = Object.values(report)
    rows.push(values)
  })
  write(columnNames, rows, 'publicReports')}

const getSharedReports = () => {
  options.uri = `${apiBaseUrl}/reports.shared`
	return rp(options)
}

const getSettings = () => {
  options.uri = `${apiBaseUrl}/settings`
	return rp(options)
}

const writeSettings = (settingsData) => {
  const rows = []
  const columnNames = Object.keys(settingsData.settings)
  const values = Object.values(settingsData.settings)
  rows.push(values)
  write(columnNames, rows, 'settings')
}

const getCheckResults = (checkID) => {
  options.uri = `${apiBaseUrl}/results/${checkID}`
	return rp(options)
}

const writeAllCheckResults = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getCheckResults(checkID)
    .then((checkResults) => {
      writeCheckResults(checkID, checkResults)
    })
  })
}

const writeCheckResults = (checkID, checkResults) => {
  const rows = []
  let values, columnNames

  checkResults.results.forEach((result) => {
    columnNames = Object.keys(result)
    columnNames.unshift('CheckID')
    values = Object.values(result)
    values.unshift(checkID)
    rows.push(values)
  })
  write(columnNames, rows, 'CheckResults')
}

const getSummaryAverage = (checkID) => {
  options.uri = `${apiBaseUrl}/summary.average/${checkID}`
	return rp(options)
}

const writeAllSummaryAverages = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getSummaryAverage(checkID)
    .then((summaryAverage) => {
      writeSummaryAverage(checkID, summaryAverage)
    })
  })
}

const writeSummaryAverage = (checkID, summaryAverage) => {
  const columnNames = ['checkID', 'avgResponse', 'from', 'to']
  const avgResponse = summaryAverage.summary.responsetime.avgresponse
  const from = summaryAverage.summary.responsetime.from
  const to = summaryAverage.summary.responsetime.to
  const rows = [[checkID, avgResponse, from, to]]
  write(columnNames, rows, 'summaryAverages')
}

const getSummaryHourly = (checkID) => {
  options.uri = `${apiBaseUrl}/summary.hoursofday/${checkID}`
	return rp(options)
}

const writeAllSummaryHourlies = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getSummaryHourly(checkID)
    .then((summaryHourly) => {
      writeSummaryHourly(checkID, summaryHourly)
    })
  })
}

const writeSummaryHourly = (checkID, summaryHourly) => {
  const columnNames = ['checkID', 'hour', 'avgResponseTime']
  const rows = []
  let values
  summaryHourly.hoursofday.forEach((hourSummary) => {
    values = [checkID, hourSummary.hour, hourSummary.avgresponse]
    rows.push(values)
  })
  write(columnNames, rows, 'HourlySummary')
}

const getOutages = (checkID) => {
  options.uri = `${apiBaseUrl}/summary.outage/${checkID}`
	return rp(options)
}

const writeAllOutages = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getOutages(checkID)
    .then((outageData) => {
      writeOutages(checkID, outageData)
    })
  })
}

const writeOutages = (checkID, outageData) => {
  const rows = []
  let values, columnNames
  outageData.summary.states.forEach((state) => {
    columnNames = Object.keys(state)
    columnNames.unshift('checkID')
    values = Object.values(state)
    values.unshift(checkID)
    rows.push(values)
  })
  write(columnNames, rows, 'outageData')
}

const getPerformanceSummary = (checkID) => {
  options.uri = `${apiBaseUrl}/summary.performance/${checkID}`
	return rp(options)
}

const writeAllPerformanceSummaries = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getPerformanceSummary(checkID)
    .then((performanceData) => {
      writePerformanceData(checkID, performanceData)
    })
  })
}

const writePerformanceData = (checkID, performanceData) => {
  const columnNames = ['CheckID', 'avgresponse', 'starttime']
  const rows = []
  let values, avgresponse, starttime
  performanceData.summary.hours.forEach((hour) => {
    avgresponse = hour.avgresponse
    starttime = hour.starttime
    rows.push([checkID, avgresponse, starttime])
  })
  write(columnNames, rows, 'performanceData')
}

const getProbeSummary = (checkID) => {
  options.uri = `${apiBaseUrl}/summary.probes/${checkID}?from=0`
	return rp(options)
}

const writeAllProbeSummaries = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getProbeSummary(checkID)
    .then((probeData) => {
      writeProbeSummaries(checkID, probeData)
    })
  })
}

const writeProbeSummaries = (checkID, probeData) => {
  const columnNames = ['probes']
  const rows = []
  let values
  probeData.probes.forEach((probe) => {
    rows.push([probe])
  })
  write(columnNames, rows, 'probeSummaries')
}

const getAnalysis = (checkID) => {
  options.uri = `${apiBaseUrl}/analysis/${checkID}`
	return rp(options)
}

const writeAllAnalyses = (checkIDs) => {
  return Promise.map(checkIDs, (checkID) => {
    return getAnalysis(checkID)
    .then((analysisData) => {
      writeAnalysisData(checkID, analysisData)
    })
  })
}

const writeAnalysisData = (checkID, analysisData) => {
  const rows = []
  let values, columnNames

  analysisData.analysis.forEach((analysisResult) => {
    columnNames = Object.keys(analysisResult)
    columnNames.unshift('CheckID')
    values = Object.values(analysisResult)
    values.unshift(checkID)
    rows.push(values)
  })
  write(columnNames, rows, 'AnalysisResults')
}

const authHeader = (credentials) => {
  let auth = "Basic " + new Buffer(credentials.user + ":" + credentials.pwd).toString("base64");
  return {
    'App-Key': credentials.token,
    Authorization : auth
  }
}

const write = (columnNames, rows, entityName) => {
  var writer = csvWriter({ headers: columnNames})
  writer.pipe(fs.createWriteStream(`${entityName}.csv`, {flags: 'a'}))
  rows.forEach((row) => {
    writer.write(row)
  })
  writer.end()
}

module.exports = {
  export: function(credentials) {
    options.headers = authHeader(credentials)
    getChecks()
    .then((checkData) =>{
      writeChecks(checkData)

      const checkIDs = []
      checkData.checks.forEach((check) => {
        checkIDs.push(check.id)
      })

      writeAllCheckResults(checkIDs)
      writeAllSummaryAverages(checkIDs)
      writeAllSummaryHourlies(checkIDs)
      writeAllOutages(checkIDs)
      writeAllPerformanceSummaries(checkIDs)
      writeAllProbeSummaries(checkIDs)
      writeAllAnalyses(checkIDs)
    })
    getTeams()
    .then((teamData) => {
      writeTeams(teamData)
    })
    getActions()
    .then((actionData) => {
      writeActions(actionData)
    })
    getProbes()
    .then((probeData) => {
      writeProbes(probeData)
    })
    getSettings()
    .then((settingsData) => {
      writeSettings(settingsData)
    })
    getMaintenanceWindows()
    .then((windowsData) => {
      writeWindows(windowsData)
    })
    getCredits()
    .then((creditData) => {
      writeCredits(creditData)
    })
    getEmailReports()
    .then((emailReportData) => {
      writeEmailReports(emailReportData)
    })
    getPublicReports()
    .then((publicReportData) => {
      writePublicReports(publicReportData)
    })
  }
}
