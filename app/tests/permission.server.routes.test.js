'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Permission = mongoose.model('Permission'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, permission;

/**
 * Permission routes tests
 */
describe('Permission CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Permission
		user.save(function() {
			permission = {
				name: 'Permission Name'
			};

			done();
		});
	});

	it('should be able to save Permission instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Permission
				agent.post('/permissions')
					.send(permission)
					.expect(200)
					.end(function(permissionSaveErr, permissionSaveRes) {
						// Handle Permission save error
						if (permissionSaveErr) done(permissionSaveErr);

						// Get a list of Permissions
						agent.get('/permissions')
							.end(function(permissionsGetErr, permissionsGetRes) {
								// Handle Permission save error
								if (permissionsGetErr) done(permissionsGetErr);

								// Get Permissions list
								var permissions = permissionsGetRes.body;

								// Set assertions
								(permissions[0].user._id).should.equal(userId);
								(permissions[0].name).should.match('Permission Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Permission instance if not logged in', function(done) {
		agent.post('/permissions')
			.send(permission)
			.expect(401)
			.end(function(permissionSaveErr, permissionSaveRes) {
				// Call the assertion callback
				done(permissionSaveErr);
			});
	});

	it('should not be able to save Permission instance if no name is provided', function(done) {
		// Invalidate name field
		permission.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Permission
				agent.post('/permissions')
					.send(permission)
					.expect(400)
					.end(function(permissionSaveErr, permissionSaveRes) {
						// Set message assertion
						(permissionSaveRes.body.message).should.match('Please fill Permission name');
						
						// Handle Permission save error
						done(permissionSaveErr);
					});
			});
	});

	it('should be able to update Permission instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Permission
				agent.post('/permissions')
					.send(permission)
					.expect(200)
					.end(function(permissionSaveErr, permissionSaveRes) {
						// Handle Permission save error
						if (permissionSaveErr) done(permissionSaveErr);

						// Update Permission name
						permission.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Permission
						agent.put('/permissions/' + permissionSaveRes.body._id)
							.send(permission)
							.expect(200)
							.end(function(permissionUpdateErr, permissionUpdateRes) {
								// Handle Permission update error
								if (permissionUpdateErr) done(permissionUpdateErr);

								// Set assertions
								(permissionUpdateRes.body._id).should.equal(permissionSaveRes.body._id);
								(permissionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Permissions if not signed in', function(done) {
		// Create new Permission model instance
		var permissionObj = new Permission(permission);

		// Save the Permission
		permissionObj.save(function() {
			// Request Permissions
			request(app).get('/permissions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Permission if not signed in', function(done) {
		// Create new Permission model instance
		var permissionObj = new Permission(permission);

		// Save the Permission
		permissionObj.save(function() {
			request(app).get('/permissions/' + permissionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', permission.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Permission instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Permission
				agent.post('/permissions')
					.send(permission)
					.expect(200)
					.end(function(permissionSaveErr, permissionSaveRes) {
						// Handle Permission save error
						if (permissionSaveErr) done(permissionSaveErr);

						// Delete existing Permission
						agent.delete('/permissions/' + permissionSaveRes.body._id)
							.send(permission)
							.expect(200)
							.end(function(permissionDeleteErr, permissionDeleteRes) {
								// Handle Permission error error
								if (permissionDeleteErr) done(permissionDeleteErr);

								// Set assertions
								(permissionDeleteRes.body._id).should.equal(permissionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Permission instance if not signed in', function(done) {
		// Set Permission user 
		permission.user = user;

		// Create new Permission model instance
		var permissionObj = new Permission(permission);

		// Save the Permission
		permissionObj.save(function() {
			// Try deleting Permission
			request(app).delete('/permissions/' + permissionObj._id)
			.expect(401)
			.end(function(permissionDeleteErr, permissionDeleteRes) {
				// Set message assertion
				(permissionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Permission error error
				done(permissionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Permission.remove().exec();
		done();
	});
});