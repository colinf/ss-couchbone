var cradle = require('cradle');

var Db = exports = module.exports = function Db (connection, dbname) {

	var conn = new(cradle.Connection)(connection);
	this.connection = conn.database(dbname);
}

Db.prototype.create = function (fields, callback) {
	this.connection.save(fields, function(err, res) {
		if (err) {
			return callback(err, null);
		}
		var response = {};
		response._id = res.id;
		response._rev = res.rev;
		return callback(null, response);
	});
}

Db.prototype.read = function (viewName, options, callback) {
	// if (viewName == 'all') {
	// 	return this.all(viewName, options, callback);
	// }
	this.connection.view(viewName, options, function(err, res) {
		if (err) {
			return callback(err, null);
		}
		var response = new Array();
		for (var i = res.length - 1; i >= 0; i--) {
			response[i] = res[i].value
		};
		return callback(null, response);
	});

}

Db.prototype.update = function (fields, callback) {
	this.connection.save(fields, function(err, res) {
		if (err) {
			return callback(err, null);
		}
		var response = {};
		response._rev = res.rev;
		return callback(null, response);
	});
}

Db.prototype.delete = function (fields, callback) {
	this.connection.remove(fields._id, fields._rev, function(err, res) {
		if (err) {
			return callback(err, null);
		}
		var response = {};
		response._rev = res.rev;
		return callback(null, response);
	});
}

var idrev = function(fields) {
	var idrevObj = {};
	idrevObj._id = fields._id;
	idrevObj._rev = fields._rev;
	console.dir(idrevObj);
	return idrevObj;
}