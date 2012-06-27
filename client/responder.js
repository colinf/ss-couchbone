// This module is sent to the browser

var ss = require('socketstream'),
    numRequests = 0,
    cbStack = {};

Backbone.Model.prototype.idAttribute = '_id';
Backbone.sync = function(method, model, options) {

  ss.cbone(method, model, options, function (err, result) {
    if (err && options.error) {
      return options.error(err);
    }
    if (options.success) {
      return options.success(result);
    }
  });
};

module.exports = function(responderId, config, send){

  // SENDING //

  // Register the ss.cbone() function
  ss.registerApi('cbone', function(){

    var args = Array.prototype.slice.call(arguments);

    var obj = {};
    obj.m = args[0];
    obj.id = ++numRequests;

    var lastArg = args[args.length - 1];
    if (typeof lastArg == 'function') {
      obj.p = args.slice(1, (args.length - 1));
      cb = lastArg;
    } else {
      obj.p = args.slice(1);
      cb = null;
    }

    cbStack[obj.id] = cb;

    var msg = JSON.stringify(obj);


    // Send the message to the server
    if (msg && msg.length > 0) {
      send(msg);
    }

  });

  // RECEIVING //

  // Listen for incoming messages
  ss.message.on(responderId, function(msg) {

    var obj = JSON.parse(msg);
    var cb = null;
    if (obj.id) {cb = cbStack[obj.id];}
    if (cb) {
      if (obj.e) {
        console.error ('Couchbone responder server error: ' + obj.e.code);
        cb(obj.e, null);
      } else {
        var response = obj.res;
        delete(response.ok);
        cb(null, response);
      }
      delete(cbStack[obj.id]);
    }

  });

}