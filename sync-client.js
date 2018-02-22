const rp = require('request-promise')
const npClient = require('./clients/nodePing/nodePingClient.js')
const argv = require('minimist')(process.argv.slice(2))

//temporary hard-coded credentials
const devCredentials = require('./credentials.js')

let source = null

//temporary source of credentials - convert to command line later
const npCredentials = devCredentials.nodePing

if (argv.s) {
  source = argv.s.toLowerCase()
}

const validSourceSites = ['statuscake', 'pingdom', 'uptimerobot']

if (validSourceSites.indexOf(source) === -1) {
  console.log('Sorry, no client exists for that source!')
  console.log(`Valid sources are ${validSourceSites}`)
  console.log('Use the argument -s <sourceSite>')
  process.exit()
}

//selectively create required egressClient
const egressClient = require(`./clients/${source}/${source}EgressClient`)

//temporary source of credentials - convert to command line later
const egressCredentials = devCredentials[source]

egressClient.getDataMap(egressCredentials)
   .then((dataMap) => {
     npClient.sync(dataMap, npCredentials)
})
