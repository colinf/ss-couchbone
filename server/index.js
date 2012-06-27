var fs = require('fs'),
    path = require('path'),
    Db = require('./db');
    db = null;

module.exports = function(responderId, config, ss){

  var name = config && config.name || 'cbone';

  /// SENDING CLIENT-SIDE CODE ///

  // Send client-side code for this responder as a module
  ss.client.send('mod', 'cbone-responder', loadFile('responder.js'));

  // Automatically initialize the client-side module when the browser loads
  ss.client.send('code', 'init', "require('cbone-responder')("+responderId+", {}, require('socketstream').send("+responderId+"));")

  // Return Responder API
  return {

    name: name,

    /// EXPOSING SERVER-SIDE INTERFACES ///

    interfaces: function(middleware){

      return {

        // Expose the Websocket interface. 
        //
        // msg  : the raw incoming message (as a string)
        // meta : an object containing additional meta data about this request
        // send : a function to send a response back to the originating client (optional)
        websocket: function(msg, meta, send){

          var rcvObj = JSON.parse(msg);
          ss.log('➞'.green, 'cbone'.grey, 'server received: ', msg);
          var sndObj = {};
          sndObj.id = rcvObj.id;
          var dbCallback = function(err, res) {
            if (err) {
              sndObj.e= err;
            } else {
              sndObj.res = res;
            }
            msg = JSON.stringify(sndObj);
            ss.log('↩'.green, 'cbone'.grey, 'sending reply: ', msg);
            send(msg);
          }

          switch (rcvObj.m) {
            case "setup":
              db = new Db(rcvObj.p[0], rcvObj.p[1]);
              sndObj.res = true;
              break;
            case "create":
              return db.create(rcvObj.p[0], dbCallback);
            case "read":
              return db.read(rcvObj.p[1].view, {}, dbCallback);
            case "update":
              return db.update(rcvObj.p[0], dbCallback);
            case "delete":
              return db.delete(rcvObj.p[0], dbCallback);
            default:
              sndObj.e = {message: 'Unknown backbone sync method'};
              return dbCallback(sndObj.e, null);
          }

        }

      }
    }
  }
}

// Helper to load client files
// Note we use readFileSync as the file is only ever loaded once when you start the server and cached in RAM thereafter
var loadFile = function(name){
  var fileName = path.join(__dirname, '../client', name);
  return fs.readFileSync(fileName, 'utf8');
}