const _ = require('lodash')
const urlParse = require('url-parse')

module.exports = {
  mapMonitorsToChecks: function(monitors) {
    const checks = []
    monitors.forEach((monitor) => {
      let check = {
        type: 'HTTP',
        label: monitor.friendly_name,
        target: monitor.url,
        enabled: "active",
        public: true,
        interval: monitor.interval,
        foreignContactIDs: []
      }
      checks.push(check)
    })
    return checks
  },
  mapContacts: function(contacts) {
    mappedContacts = []
    contacts.alert_contacts.forEach((contact) => {
      if (contact.type === 2) {
        contactType = 'email'
        contactAddress = contact.value
      } else if (contact.type === 5) {
        contactType = 'webhook'
        contactAddress = urlParse(contact.value).host
      }
      mappedContact = {
        foreignID: parseInt(contact.id),
        custrole: 'owner',
        name: contact.friendly_name,
        contactAddress: contactAddress,
        contactType: contactType,
        foreignContactGroups: []
      }
      mappedContacts.push(mappedContact)
    })
    return mappedContacts
  },
  mapContactsToChecks: function(checks, contactMap) {
    contacts = []
    contactMap.forEach((contact) => {
      contacts.push(contact.foreignID)
    })
    checks.forEach((check) => {
      check.foreignContactIDs = [contacts]
    })
    return checks
  }
}
