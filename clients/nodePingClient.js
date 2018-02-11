const rp = require('request-promise')
const Promise = require('bluebird')
const utils = require('./NP_utils.js')
const _ = require('lodash')
//const credentials = require('../credentials.js')
const apiBaseUrl = 'https://api.nodeping.com/api/1/'


const syncContactsAndGroups = (dataMap, credentials) => {
  let foreignContacts = dataMap.contactMap

  let options = {
    method: 'POST',
    uri: `${apiBaseUrl}contacts/?token=${credentials.token}`,
    json: true
  }

  return utils.getNpContacts()
  .then((NpContacts) => {
    return utils.mapContacts(NpContacts, foreignContacts)
    .then((newMap) => {
      return Promise.map(newMap, (mappedContact) => {
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
        return utils.mapContactsToGroups(mappedContacts)
        .then((createdGroups) => {
          return createdGroups
        })
      })
    })
  })
}

const syncChecks = (checks, contactsAndGroups, credentials) => {
  return Promise.map(checks, (check) => {
    let notifications = []
    check.foreignContactIDs.forEach((foreignIDArray) => {
      foreignIDArray.forEach((foreignID) => {
        contactsAndGroups.forEach((contactGroup) => {
          if (contactGroup.foreignID === parseInt(foreignID)) {
            let npID = contactGroup.npID
            let notification = {}
            let notification[npID] = {schedule: 'All', delay: 0}
            notifications.push(notification)
          }
        })
      })
    })
    let newCheck = {
      type: check.type,
      label: check.label,
      target: check.target,
      public: check.public,
      interval: check.interval,
      notifications: notifications
    }
    let options = {
      method: 'POST',
      uri: `${apiBaseUrl}checks/?token=${credentials.token}`,
      json: true,
      body: newCheck
    }
    return rp(options)
  })
}

module.exports = {
  sync: function(data, credentials) {
    syncContactsAndGroups(data, credentials)
    .then((contactsAndGroups) => {
      syncChecks(data.checks, contactsAndGroups, credentials)
    })
    .then((syncedChecks) => {
      console.log(syncedChecks)
    })
  }
}
