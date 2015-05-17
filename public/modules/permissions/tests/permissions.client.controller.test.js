'use strict';

(function() {
	// Permissions Controller Spec
	describe('Permissions Controller Tests', function() {
		// Initialize global variables
		var PermissionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Permissions controller.
			PermissionsController = $controller('PermissionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Permission object fetched from XHR', inject(function(Permissions) {
			// Create sample Permission using the Permissions service
			var samplePermission = new Permissions({
				name: 'New Permission'
			});

			// Create a sample Permissions array that includes the new Permission
			var samplePermissions = [samplePermission];

			// Set GET response
			$httpBackend.expectGET('permissions').respond(samplePermissions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.permissions).toEqualData(samplePermissions);
		}));

		it('$scope.findOne() should create an array with one Permission object fetched from XHR using a permissionId URL parameter', inject(function(Permissions) {
			// Define a sample Permission object
			var samplePermission = new Permissions({
				name: 'New Permission'
			});

			// Set the URL parameter
			$stateParams.permissionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/permissions\/([0-9a-fA-F]{24})$/).respond(samplePermission);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.permission).toEqualData(samplePermission);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Permissions) {
			// Create a sample Permission object
			var samplePermissionPostData = new Permissions({
				name: 'New Permission'
			});

			// Create a sample Permission response
			var samplePermissionResponse = new Permissions({
				_id: '525cf20451979dea2c000001',
				name: 'New Permission'
			});

			// Fixture mock form input values
			scope.name = 'New Permission';

			// Set POST response
			$httpBackend.expectPOST('permissions', samplePermissionPostData).respond(samplePermissionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Permission was created
			expect($location.path()).toBe('/permissions/' + samplePermissionResponse._id);
		}));

		it('$scope.update() should update a valid Permission', inject(function(Permissions) {
			// Define a sample Permission put data
			var samplePermissionPutData = new Permissions({
				_id: '525cf20451979dea2c000001',
				name: 'New Permission'
			});

			// Mock Permission in scope
			scope.permission = samplePermissionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/permissions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/permissions/' + samplePermissionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid permissionId and remove the Permission from the scope', inject(function(Permissions) {
			// Create new Permission object
			var samplePermission = new Permissions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Permissions array and include the Permission
			scope.permissions = [samplePermission];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/permissions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePermission);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.permissions.length).toBe(0);
		}));
	});
}());