const rp = require('request-promise');
const Promise = require('bluebird');

const apiBaseUrl = 'https://api.nodeping.com/api/1/';


module.exports = {
  syncContacts: function(contacts, credentials) {
    contactIDs = Object.keys(contacts)
    var options = {
      method: 'POST',
      uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
      json: true
    };

    Promise.map(contactIDs, (contactID) => {
      contactGroup = contacts[contactID]
      contactGroup.emails.forEach((email) => {
        options.body = {
          name: email,
          newaddresses: [{
            address: email,
            type: 'email'
          }]
        },
        rp(options)
        .then((results) => {
          console.log(results)
        })
      })
      contactGroup.mobiles.forEach((mobile) => {
        options.body = {
          name: mobile,
          newaddresses: [{
            address: mobile,
            type: 'mobile'
          }]
        },
        rp(options)
        .then((results) => {
          console.log(results)
        })
      })
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
