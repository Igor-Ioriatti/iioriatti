'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Permission Schema
 */
var PermissionSchema = new Schema({
	role: {
		type: [{
			type: String,
			enum: ['company', 'architect', 'vendor', 'user', 'editor', 'admin']
		}],
		default: ['user']
	},
	resources:[{
			type:String
	}],
	permissions:{
		type: [{
			type: String,
			enum: ['*', 'get', 'post']
		}],
		default: ['get']
	}
});

mongoose.model('Permission', PermissionSchema);