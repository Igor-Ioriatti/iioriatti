'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var permissions = require('../../app/controllers/permissions.server.controller');

	// Permissions Routes
	app.route('/permissions')
		.get(permissions.list)
		.post(users.requiresLogin, permissions.create);

	app.route('/permissions/:permissionId')
		.get(permissions.read)
		.put(users.requiresLogin, permissions.hasAuthorization, permissions.update)
		.delete(users.requiresLogin, permissions.hasAuthorization, permissions.delete);

	// Finish by binding the Permission middleware
	app.param('permissionId', permissions.permissionByID);
};
