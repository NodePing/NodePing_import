# NodePing_node
Node.js library for interacting with NodePing API

Work in Progress.  When this code is deployable, it will be merged to master.

To test, create `credentials.js` in top-level directory

`credentials.js` should contain:

```
module.exports = {
  nodePing: {
    token: '<nodePingToken>',
    user: '<nodePingUser>'
  },
  statuscake: {
    token: '<statusCakeToken>',
    user: '<statusCakeUser>'
  }
};
```
caveats:
  For pingdom, include a 'pwd' property, which is your pingdom password

Then execute
`node sync-client.js -s statuscake` to sync data from the source to NodePing

It is recommended to additionally export all data from the source platform by using the `--export` flag as follows:

`node sync-client.js -s statuscake --export`
