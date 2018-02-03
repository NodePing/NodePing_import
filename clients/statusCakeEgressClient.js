const rp = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

const apiBaseUrl = 'https://app.statuscake.com/API/';

const mapTestToCheck = function (test) {
  const check = {
    type: test.TestType,
    label: test.WebsiteName,
    target: test.WebsiteURL,
    enabled: !test.Paused,
    public: test.Public,
    interval: test.CheckRate / 60
  };
  return check;
};

const mapContactsAndGroups = function (contactGroups) {
  var contactMap = {};

  contactGroups.forEach((contactGroup) => {
    var contactID = contactGroup.ContactID
    contactMap[contactID] = {
      groupName: contactGroup.GroupName
    };
    if (contactGroup.Mobiles === '') {
      contactMap[contactID].mobiles = []
    } else {
      contactMap[contactID].mobiles = contactGroup.Mobiles
    }
    contactMap[contactID].emails = contactGroup.Emails
  })
  return contactMap;
}

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
        tests.push(mapTestToCheck(result));
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
      return mapContactsAndGroups(results);
    })
  }
}
