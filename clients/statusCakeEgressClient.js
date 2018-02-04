const rp = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');
const utils = require('./SC_utils.js');

const apiBaseUrl = 'https://app.statuscake.com/API/';

module.exports = {
  getTests: function(credentials) {
    const tests = [];
    var options = {
      uri: `${apiBaseUrl}Tests/`,
      headers: {
          'API': credentials.token,
          'Username': credentials.user
      },
      json: true
    };
    return rp(options)
    .then((results) => {
      results.forEach((result) => {
        tests.push(utils.mapTestToCheck(result));
      });
      return tests
    })
  },
  getContactGroups: function(credentials) {
    var options = {
      uri: `${apiBaseUrl}ContactGroups/`,
      headers: {
          'API': credentials.token,
          'Username': credentials.user
      },
      json: true
    };
    return rp(options)
    .then((results) => {
      return utils.mapContactsAndGroups(results);
    })
  }
}
