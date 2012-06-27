# Couchbone Request Responder for SocketStream

This is a Request Responder for [SocketStream](http://www.socketstream.org/) which connects a [backbone.js](http://backbonejs.org/) model in the browser to a [CouchDB](http://couchdb.apache.org/) database at the server end.

The couchbone responder overrides the Backbone.sync method so that all create, read, update and delete actions are sent to the server using Socketstream (the default is websockets if supported in your browser) and applied to the specified CouchDB database.

This is an initial 0.0.x version with the corresponding limited functionality and limited testing. It should be used with caution!

### Example Application
The best way to get started with ss-couchbone is to take a look at the [example application](https://github.com/colinf/couchbone-todos) which uses ss-couchbone to implement a version of the well known Backbone.js Todos example application with persistence to CouchDB using Socketstream.

### Try it out
Clone the repo locally and install it with:

    [sudo] npm link

Create a new SocketStream project and create a local link to this repo:

    cd my_new_socketstream_project
    [sudo] npm link ss-couchbone

Add the Couchbone responder to your socketstream stack:

```javascript
// in app.js
ss.responders.add(require('ss-couchbone'));
```

***
