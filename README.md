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
  statusCake: {
    token: '<statusCakeToken>',
    user: '<statusCakeUser>'
  }
};
```

Then execute `node sync-client.js -s statusCake`
