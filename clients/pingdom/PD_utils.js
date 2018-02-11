const _ = require('lodash')

module.exports = {
  mapPDChecksToNPChecks: function(checks) {
    const NPChecks = []
    checks.forEach((PDCheck) => {
      type = Object.keys(PDCheck.check.type)[0]
      let check = {
        type: type,
        label: PDCheck.check.name,
        target: PDCheck.check.hostname,
        enabled: false,
        public: true,
        interval: PDCheck.check.resolution,
        foreignContactIDs: PDCheck.check.userids
      }

      NPChecks.push(check)
    })
    return NPChecks
  },
  mapUsersAndTeams: function(usersAndTeams) {
    contacts = []
    users = usersAndTeams.users.users
    users.forEach((user) => {
      contact = {
        foreignID: user.id,
        name: user.name,
        addresses: user.email,
        contactType: 'email',
      }
      contacts.push(contact)
    })
    return contacts
  }
}
