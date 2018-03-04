# NodePing_node
Node.js library for interacting with NodePing API

Work in Progress.  When this code is deployable, it will be merged to master.

To test, create `credentials.js` in top-level directory

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

Then execute
`node sync-client.js -s <source platform>` to sync data from the source to NodePing

ie, `node sync-client.js -s statuscake`

It is recommended to additionally export all data from the source platform by using the `--export` flag as follows:

`node sync-client.js -s <source platform> --export`
