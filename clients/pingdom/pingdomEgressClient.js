const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./PD_utils.js')

const apiBaseUrl = 'https://api.pingdom.com/api/2.0'

module.exports = {
  getDataMap: function(credentials) {
    auth = "Basic " + new Buffer(credentials.user + ":" + credentials.pwd).toString("base64");
    let options = {
      method: 'GET',
      headers: {
        'App-Key': credentials.token,
        Authorization : auth
      },
      uri: `${apiBaseUrl}/checks`,
      json: true
    }
    return rp(options)
  }
}
