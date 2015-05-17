'use strict';

// Permissions controller
angular.module('permissions').controller('PermissionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Permissions',
	function($scope, $stateParams, $location, Authentication, Permissions) {
		$scope.authentication = Authentication;

			$scope.credentials = {
				roles: {
					type: [{
						type: String,
						enum: ['company', 'architect', 'vendor', 'user', 'editor', 'admin']
					}],
					role: 'user',
					desc:'User Type',
					hide:false
				},
				permissions: {
					type: [{
						type: String,
						enum: ['*', 'get', 'post']
					}],
					permission: 'get',
					desc:'Permission',
					hide:false
				}
		};


		// Create new Permission
		$scope.create = function() {
			// Create new Permission object
			var permission = new Permissions ({
				role: this.credentials.role,
				resources:[],
				permissions:[]
			});

			// Redirect after save
			permission.$save(function(response) {
				$location.path('permissions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Permission
		$scope.remove = function(permission) {
			if ( permission ) { 
				permission.$remove();

				for (var i in $scope.permissions) {
					if ($scope.permissions [i] === permission) {
						$scope.permissions.splice(i, 1);
					}
				}
			} else {
				$scope.permission.$remove(function() {
					$location.path('permissions');
				});
			}
		};

		// Update existing Permission
		$scope.update = function() {
			var permission = $scope.permission;

			permission.$update(function() {
				$location.path('permissions/' + permission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Permissions
		$scope.find = function() {
			$scope.permissions = Permissions.query();
		};

		// Find existing Permission
		$scope.findOne = function() {
			$scope.permission = Permissions.get({ 
				permissionId: $stateParams.permissionId
			});
		};
	}
]);