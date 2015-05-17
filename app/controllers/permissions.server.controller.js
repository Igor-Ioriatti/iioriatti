'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Permission = mongoose.model('Permission'),
	_ = require('lodash');

/**
 * Create a Permission
 */
exports.create = function(req, res) {
	var permission = new Permission(req.body);
	permission.user = req.user;

	permission.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(permission);
		}
	});
};

/**
 * Show the current Permission
 */
exports.read = function(req, res) {
	res.jsonp(req.permission);
};

/**
 * Update a Permission
 */
exports.update = function(req, res) {
	var permission = req.permission ;

	permission = _.extend(permission , req.body);

	permission.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(permission);
		}
	});
};

/**
 * Delete an Permission
 */
exports.delete = function(req, res) {
	var permission = req.permission ;

	permission.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(permission);
		}
	});
};

/**
 * List of Permissions
 */
exports.list = function(req, res) { 
	Permission.find().sort('-created').populate('user', 'displayName').exec(function(err, permissions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(permissions);
		}
	});
};

/**
 * Permission middleware
 */
exports.permissionByID = function(req, res, next, id) { 
	Permission.findById(id).populate('user', 'displayName').exec(function(err, permission) {
		if (err) return next(err);
		if (! permission) return next(new Error('Failed to load Permission ' + id));
		req.permission = permission ;
		next();
	});
};

/**
 * Permission authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*
	if (req.permission.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
