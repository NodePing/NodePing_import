const rp = require('request-promise');
const Promise = require('bluebird');

const apiBaseUrl = 'https://api.nodeping.com/api/1/';


module.exports = {
  syncContacts: function(contacts, credentials) {
    Promise.map(contacts, (contact) => {
      var options = {
        method: 'POST',
        uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
        body: {
          name: contact,
          newaddresses: [{
            address: contact,
            type: 'email'
          }]
        },
        json: true
      };
      return rp(options);
    })
    .then((results) => {
      console.log(results);
    })
  },

  syncContactGroups: function(contactGroups, credentials) {
    Promise.map(contactGroups, (contactGroup) => {
      var options = {
        method: 'POST',
        uri: `${apiBaseUrl}contactgroups/?token=${credentials.token}`,
        body: {
          name: contactGroup.GroupName,
          members: contactGroup.Emails
        },
        json: true
      };
      return rp(options);
    })
    .then((results) => {
      console.log(results);
    })
  },

  syncTests: function(tests, credentials) {
    Promise.map(tests, (test) => {
      var options = {
        method: 'POST',
        uri: `${apiBaseUrl}checks/?token=${credentials.token}`,
        body: test,
        json: true
      };
      return rp(options)
    })
    .then((results) => {
      console.log(results);
    });
  }
}
