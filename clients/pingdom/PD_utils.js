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
    console.log(usersAndTeams.userTeams.teams)
    console.log(usersAndTeams.users.users)
  }
}
