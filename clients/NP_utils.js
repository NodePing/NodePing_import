const rp = require('request-promise');
const Promise = require('bluebird');
const credentials = require('../credentials.js');
const _ = require('lodash');
const apiBaseUrl = 'https://api.nodeping.com/api/1/';

npCredentials = credentials.nodePing;
var options = {
  method: 'GET',
  uri: `${apiBaseUrl}contacts/?token=${npCredentials.token}`,
  json: true
};

module.exports = {
  getNpContacts: function() {
    return rp(options)
  },
  //map foreign contacts to existing NP contacts, match on email
  mapContacts: function(NpContacts, foreignContacts) {
    return Promise.map(foreignContacts, (foreignContact) => {
      contact = _.cloneDeep(foreignContact);

      for (NpContactID in NpContacts) {
        NpContact = NpContacts[NpContactID]
        if (NpContact.name === foreignContact.contactAddress){
          contact.NpContact = NpContact;
        }
      }
      return contact
    })
  },
  createContact: function(contactInfo) {
    options.method = 'PUT'
    options.body = contactInfo
    return rp(options)
    .then((results) => {
      console.log(results)
    })
  }
}
