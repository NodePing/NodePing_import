const rp = require('request-promise')
const Promise = require('bluebird')
const credentials = require('../credentials.js')
const _ = require('lodash')
const apiBaseUrl = 'https://api.nodeping.com/api/1/'

npCredentials = credentials.nodePing
var options = {
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
      contact = _.cloneDeep(foreignContact)

      for (NpContactID in NpContacts) {
        NpContact = NpContacts[NpContactID]
        if (NpContact.name === foreignContact.contactAddress){
          contact.NpContact = NpContact
        }
      }
      return contact
    })
  },
  mapContactsToGroups: function(contactMap) {
    invertedGroupMap = {}

    Promise.map(contactMap, (contact) => {

      foreignGroups = contact.foreignContactGroups
      foreignGroups.forEach((group) => {
        mappedGroups = Object.keys(invertedGroupMap)
        address = Object.keys(contact.NpContact.addresses)[0]
        groupName = group.groupName
        if (mappedGroups.indexOf(groupName) === -1){
          invertedGroupMap[groupName] = {
            foreignID: group.groupID,
            addresses: [address]
          }
        } else {
          invertedGroupMap[groupName].addresses.push(address)
        }
      })
      return invertedGroupMap

    })
    console.log(invertedGroupMap)
  },
  createContact: function(contactInfo) {
    payload = {
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
