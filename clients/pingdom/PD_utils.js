const _ = require('lodash')


const getUserTeams = (userID, teams) => {
    userTeams = {}
    teams.forEach((team) => {
      team.users.forEach((user) => {
        if (parseInt(user.id) === parseInt(userID)) {
          userTeams[team.name] = {
            foreignID: team.id,
            npID: null
          }
        }
      })
    })
    return userTeams
}


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
    let teams = usersAndTeams.userTeams.teams
    let users = usersAndTeams.users.users

    users.forEach((user) => {
      let userTeams = getUserTeams(user.id, teams)
      contact = {
        foreignID: user.id,
        name: user.name,
        contactAddress: user.email[0].address,
        contactType: 'email',
        foreignContactGroups: userTeams
      }
      contacts.push(contact)
    })
    return contacts
  }
}
