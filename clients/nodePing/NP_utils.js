const rp = require('request-promise')
const Promise = require('bluebird')
const credentials = require('../../credentials.js')
const _ = require('lodash')
const apiBaseUrl = 'https://api.nodeping.com/api/1/'

const npCredentials = credentials.nodePing
let options = {
  method: 'GET',
  uri: `${apiBaseUrl}contacts/?token=${npCredentials.token}`,
  json: true
}

const logError = (error, endpointName) => {
  if (error.statusCode === 403) {
    console.log('Invalid credentials.  Please verify contents of credentials.js')
    process.exit()
  } else {
    console.log(error.message)
    process.exit()
  }
  process.exit()
}

const createContactGroup = (groupInfo) => {
  console.log(`creating new ContactGroup: ${groupInfo.name}`)
  options.uri = `${apiBaseUrl}contactgroups/?token=${npCredentials.token}`
  options.method = 'POST'
  options.body = groupInfo
  return rp(options)
  .catch((err) => {
    logError(err, 'createContactGroup')
  })
}

module.exports = {
  getNpContacts: function() {
    return rp(options)
    .catch((err) => {
      logError(err, 'getNpContacts')
    })
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
    if (contactMap.length > 0) {
      const groupMap = {}
      contactMap.forEach((contact) => {
        mappedGroups = Object.keys(groupMap)
        contactGroups = contact.foreignContactGroups

        addresses = Object.keys(contact.NpContact.addresses)
        for (groupName in contactGroups) {
          if (mappedGroups.indexOf(groupName) === -1) {
            groupMap[groupName] = {
              foreignID: contactGroups[groupName].foreignID,
              addresses: addresses,
              npID: null
            }
          } else {
            groupMap[groupName].addresses = _.union(groupMap[groupName].addresses, addresses)
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
    }
  },
  createContact: function(contactInfo) {
    let payload = {
      name: contactInfo.contactAddress,
      type: contactInfo.contactType,
      custrole: contactInfo.custrole,
      address: contactInfo.contactAddress,
      newaddresses: [{
        type: contactInfo.contactType,
        address: contactInfo.contactAddress
      }]
    }
    console.log(`Creating new contact: ${contactInfo.contactAddress}`)
    options.method = 'POST'
    options.body = payload
    return rp(options)
    .catch((err) => {
      logError(err, 'createContact')
    })
  }
}
