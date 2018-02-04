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
        Promise.map(newMap, (mappedContact) => {
            if (_.has(mappedContact, 'NpContact')) {
              return mappedContact
            } else {
              return utils.createContact(mappedContact)
              .then((createdContact) => {
                mappedContact.NpContact = _.cloneDeep(createdContact);
                return mappedContact
              })
            }
        })
        .then((mappedContacts) => {
          groupMap = {}
          newMap.forEach((contact) => {
              groups = contact.foreignContactGroups;
              address = Object.keys(contact.NpContact.addresses)[0]
              groups.forEach((group) => {
                mappedGroups = Object.keys(groupMap)
                groupName = group.groupName

                if (mappedGroups.indexOf(groupName) === -1) {
                  groupMap[groupName] = [address]
                } else {
                  groupMap[groupName].push(address)
                }
              })
          })
          for (groupName in groupMap) {
            members = groupMap[groupName]
            utils.createContactGroup({
              name: groupName,
              members: members
            })
            .then((results) => {
              console.log(results)
            })
          }
        })
      })
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
