const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./NP_utils.js')
const _ = require('lodash')
//const credentials = require('../credentials.js')
const apiBaseUrl = 'https://api.nodeping.com/api/1/'


const syncContactsAndGroups = (dataMap, credentials) => {
  let foreignContacts = dataMap.contactMap;
  
  var options = {
    method: 'POST',
    uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
    json: true
  }

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
              mappedContact.NpContact = _.cloneDeep(createdContact)
              return mappedContact
            })
          }
      })
      .then((mappedContacts) => {
        utils.mapContactsToGroups(mappedContacts)
      })
    })
  })
}

module.exports = {
  sync: function(data, credentials) {
    syncContactsAndGroups(data, credentials)
    //console.log(data)
  },

  syncContacts: function(foreignContacts, credentials) {
    var options = {
      method: 'POST',
      uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
      json: true
    }

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
                mappedContact.NpContact = _.cloneDeep(createdContact)
                return mappedContact
              })
            }
        })
        .then((mappedContacts) => {
          utils.mapContactsToGroups(mappedContacts)
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
      }
      return rp(options)
    })
    .then((results) => {
      //console.log(results)
    })
  }
}
