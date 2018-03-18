# NodePing_node
Node.js library for interacting with NodePing API

**Requirements:**

Node.js (Tested with v9.5.0)

npm (Tested with v5.6.0)

**Steps to Migrate**

* Download/clone, execute `npm install` in top level directory

* Create `credentials.js` in top-level directory (`NodePing_node`)  This will contain
your token, username, and/or password for the service you are migrating from.  


* Then execute `node sync-client.js -s <source platform>` to sync data from the source to NodePing
ie, `node sync-client.js -s statuscake`

* It is recommended to additionally export all data from the source platform by using the `--export` flag as follows:
`node sync-client.js -s <source platform> --export`

`credentials.js` should contain entries for NodePing and the target foreign platform:

```
module.exports = {
  nodePing: {
    token: '<nodePing token>',
    user: '<nodePing login(email)>'
  },
  statuscake: {
    token: '<statusCake token>',
    user: '<statusCake username>'
  },
  pingdom: {
    token: '<pingdom token>',
    user: '<pingdom login(email)',
    pwd: '<pingdom password'
  },
  uptimerobot: {
    token: '<uptimerobot token>'
  }
};
```

You only need entries for NodePing and the foreign platform you're pulling data from.  If you're pulling from
pingdom, you can leave out the entries for StatusCake and UptimeRobot, for instance.




## Caveats / Known Limitations:

* If a contact or contact group already exists in NodePing (ie, if an identical email/webhook address exists), it will not be created (not a limitation, just something to be aware of)

* Some platforms have some entities that do not correspond to entities in NodePing, so those entities will
not be created in NodePing.  For this reason, it is *strongly* recommended that you run the `--export` option
as described above.  In this way, you will keep a record of all of your data.

* If you run the sync client more than once, you will create duplicate checks in NodePing.


* Some Premium tier features are not supported and/or have not been tested.
