const _ = require('lodash')

module.exports = {
  //map statusCake check to NodePing test
  mapTestsToChecks: function (tests) {
    const checks = []
    tests.forEach((test) => {
      let check = {
        type: test.TestType,
        label: test.WebsiteName,
        target: test.WebsiteURL,
        enabled: !test.Paused,
        public: test.Public,
        interval: test.CheckRate / 60,
        foreignContactIDs: [test.ContactGroup]
      }
      checks.push(check)
    })
    return checks
  },
  //remap statusCake contactGroups into array of contacts
  mapContactsAndGroups: function (contactGroups) {
    var contacts = []
    var emails = []
    contactGroups.forEach((contactGroup) => {
      emails = _.union(emails, contactGroup.Emails)
    })
    emails.forEach((email) => {
      var contact = {
        contactAddress: email,
        contactType: 'email',
        custrole: 'owner',
        foreignContactGroups: {}
      }
      contact.contactAddress = email
      contact.contactType = 'email'
      contactGroups.forEach((contactGroup) => {
        groupID = contactGroup.ContactID
        groupName = contactGroup.GroupName
        if (contactGroup.Emails.indexOf(email > -1)) {
          contact.foreignContactGroups[groupName] = {foreignID: groupID, npID: null}
        }
      })
      contacts.push(contact)
    })
    return contacts
  }
}
