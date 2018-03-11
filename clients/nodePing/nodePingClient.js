const rp = require('request-promise')
const Promise = require('bluebird')
const normalizeUrl = require('normalize-url')
const utils = require('./NP_utils.js')
const _ = require('lodash')

const apiBaseUrl = 'https://api.nodeping.com/api/1/'

const options = {
  method: 'POST',
  json: true
}


const logError = (error, endpointName) => {
  console.log(`Error when invoking ${endpointName}: ${error.error.message}`)
}


const syncContactsAndGroups = (dataMap, credentials) => {
  let foreignContacts = dataMap.contactMap

  options.uri = `${apiBaseUrl}contacts/?token=${credentials.token}`

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
              if (createdContact) {
                mappedContact.NpContact = _.cloneDeep(createdContact)
                return mappedContact
              }
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

    options.uri = `${apiBaseUrl}checks/?token=${credentials.token}`
    options.body = newCheck

    console.log(`Creating new check: ${newCheck.label}`)
    return rp(options)
    .catch((err) => {
      logError(err, 'syncChecks')
    })
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
