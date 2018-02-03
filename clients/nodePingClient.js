const rp = require('request-promise');
const Promise = require('bluebird');

const apiBaseUrl = 'https://api.nodeping.com/api/1/';


module.exports = {
  syncContactGroups: function(contactGroups, credentials) {
    Promise.map(contactGroups, (contactGroup) => {
      var options = {
        method: 'POST',
        uri: `${apiBaseUrl}contactgroups/?token=${credentials.token}`,
        body: {
          name: contactGroup.GroupName,
          members: contactGroup.members
        },
        json: true
      };
      return rp(options);
    })
    .then((results) => {
      console.log(results);
    })
  },
  syncTests: function(tests, credentials) {
    Promise.map(tests, (test) => {
      console.log(test)
      var options = {
        method: 'POST',
        uri: `${apiBaseUrl}checks/?token=${credentials.token}`,
        body: test,
        json: true
      };
      return rp(options)
    })
    .then((results) => {
      console.log(results);
    });
  }
}
