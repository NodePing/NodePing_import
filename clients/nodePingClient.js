const rp = require('request-promise');
const Promise = require('bluebird');
const utils = require('./NP_utils.js');
const _ = require('lodash');
//const credentials = require('../credentials.js');
const apiBaseUrl = 'https://api.nodeping.com/api/1/';


module.exports = {
  syncContacts: function(foreignContacts, credentials) {
    var options = {
      method: 'POST',
      uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
      json: true
    };

    utils.getNpContacts()
    .then((NpContacts) => {
      utils.mapContacts(NpContacts, foreignContacts)
      .then((newMap) => {
        newMap.forEach((mappedContact) => {
          if (_.has(mappedContact, 'NpContact')) {
            //console.log(mappedContact)
          } else {
            utils.createContact({
              name: mappedContact.contactAddress,
              type: mappedContact.contactType,
              address: mappedContact.contactAddress
            })
          }
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
