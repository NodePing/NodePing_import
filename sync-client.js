const rp = require('request-promise');
const npClient = require('./clients/nodePingClient.js')
const argv = require('minimist')(process.argv.slice(2));

//temporary hard-coded credentials
const devCredentials = require('./credentials.js');

//temporary source of credentials - convert to command line later
const npCredentials = devCredentials.nodePing;
const source = argv.s;
const validSourceSites = ['statusCake'];

if (validSourceSites.indexOf(source) === -1) {
  console.log('Sorry, no client exists for that source!');
  console.log(`Valid sources are ${validSourceSites}`);
  console.log('Use the argument -s <sourceSite>');
  process.exit();
}

egressClient = require(`./clients/${source}EgressClient`);

//temporary source of credentials - convert to command line later
egressCredentials = devCredentials[source];

const contactGroups = egressClient.discoverContacts(egressCredentials);
//npClient.sync(contactGroups);
