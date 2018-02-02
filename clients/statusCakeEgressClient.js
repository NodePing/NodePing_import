const rp = require('request-promise');

const apiBaseUrl = 'https://app.statuscake.com/API/';

module.exports = {
  discover: function(credentials) {
    return null;
  },
  retrieveData: function(credentials) {
    return null;
  },
  discoverContacts: function(credentials) {
    var options = {
      uri: `${apiBaseUrl}ContactGroups/`,
      headers: {
          'API': credentials.token,
          'Username': credentials.user
      },
      json: true
    };
    rp(options)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (err) {
        console.log(err);
    });
  }

}
