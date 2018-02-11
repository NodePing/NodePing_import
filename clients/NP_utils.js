const rp = require('request-promise')
const Promise = require('bluebird')
const credentials = require('../credentials.js')
const _ = require('lodash')
const apiBaseUrl = 'https://api.nodeping.com/api/1/'

const npCredentials = credentials.nodePing
let options = {
  method: 'GET',
  uri: `${apiBaseUrl}contacts/?token=${npCredentials.token}`,
  json: true
}

const createContactGroup = (groupInfo) => {
  options.uri = `${apiBaseUrl}contactgroups/?token=${npCredentials.token}`
  options.method = 'POST'
  options.body = groupInfo
  return rp(options)
}

module.exports = {
  getNpContacts: function() {
    return rp(options)
  },
  //map foreign contacts to existing NP contacts, match on email
  mapContacts: function(NpContacts, foreignContacts) {
    return Promise.map(foreignContacts, (foreignContact) => {
      let contact = _.cloneDeep(foreignContact)

      for (NpContactID in NpContacts) {
        let NpContact = NpContacts[NpContactID]
        if (NpContact.name === foreignContact.contactAddress){
          contact.NpContact = NpContact
        }
      }
      return contact
    })
  },
  mapContactsToGroups: function(contactMap) {
    const groupMap = {}
    contactMap.forEach((contact) => {
      let mappedGroups = Object.keys(groupMap)
      let contactGroups = contact.foreignContactGroups

      let addresses = Object.keys(contact.NpContact.addresses)
      for (groupName in contactGroups) {
        if (mappedGroups.indexOf(groupName) === -1) {
          let groupMap[groupName] = {
            foreignID: contactGroups[groupName].foreignID,
            addresses: addresses,
            npID: null
          }
        } else {
          let groupMap[groupName].addresses = _.union(groupMap[groupName].addresses, addresses)
        }
      }
    })
    return Promise.map(mappedGroups, (groupName) => {
      let groupMembers = groupMap[groupName].addresses
      return createContactGroup({name: groupName, members: groupMembers})
      .then((response) => {
        groupMap[groupName].npID = response._id
        return groupMap[groupName]
      })
    })
  },
  createContact: function(contactInfo) {
    let payload = {
      name: contactInfo.contactAddress,
      type: contactInfo.contactType,
      address: contactInfo.contactAddress,
      newaddresses: [{
        type: contactInfo.contactType,
        address: contactInfo.contactAddress
      }]
    }
    options.method = 'POST'
    options.body = payload
    return rp(options)
  }
}
