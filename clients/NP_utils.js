const rp = require('request-promise');
const Primise = require('bluebird');
const credentials = require('../credentials.js');
const apiBaseUrl = 'https://api.nodeping.com/api/1/';

npCredentials = credentials.nodePing;

module.exports = {
  getNpContacts: function() {
    var options = {
      method: 'GET',
      uri: `${apiBaseUrl}contacts/?token=${npCredentials.token}`,
      json: true
    };
    return rp(options)
  }
}
