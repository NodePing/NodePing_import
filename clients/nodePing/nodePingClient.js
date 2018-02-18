const rp = require('request-promise')
const Promise = require('bluebird')
const normalizeUrl = require('normalize-url');
const utils = require('./NP_utils.js')
const _ = require('lodash')
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
          return {
            createdGroups,
            mappedContacts
          }
        })
      })
    })
  })
}

const syncChecks = (checks, contactsAndGroups, credentials) => {
  createdGroups = contactsAndGroups.createdGroups
  mappedContacts = contactsAndGroups.mappedContacts
  return Promise.map(checks, (check) => {
    notifications = []
    check.foreignContactIDs.forEach((foreignIDArray) => {
      foreignIDArray.forEach((foreignID) => {
        createdGroups.forEach((createdGroup) => {
          if (parseInt(createdGroup.foreignID) === parseInt(foreignID)) {
            npID = createdGroup.npID
            notification = {}
            notification[npID] = {shedule: 'All', delay: 0}
            notifications.push(notification)
          }
        })
        mappedContacts.forEach((contact) => {
          if (parseInt(contact.foreignID) === parseInt(foreignID)) {
            npID = Object.keys(contact.NpContact.addresses)[0]
            notification = {}
            notification[npID] = {schedule: 'All', delay: 0}
            notifications.push(notification)
          }
          })
        })
      })
    let newCheck = {
      type: check.type.toUpperCase(),
      label: check.label,
      target: normalizeUrl(check.target),
      public: check.public,
      enabled: check.enabled,
      interval: check.interval,
      notifications: notifications
    }
    let options = {
      method: 'POST',
      uri: `${apiBaseUrl}checks/?token=${credentials.token}`,
      json: true,
      body: newCheck
    }
    console.log(`Creating new check: ${newCheck.label}`)
    return rp(options)
  })
}

module.exports = {
  sync: function(data, credentials) {
    syncContactsAndGroups(data, credentials)
    .then((contactsAndGroups) => {
      syncChecks(data.checks, contactsAndGroups, credentials)
    })
  }
}
