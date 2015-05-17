'use strict';

//Setting up route
angular.module('permissions').config(['$stateProvider',
	function($stateProvider) {
		// Permissions state routing
		$stateProvider.
		state('listPermissions', {
			url: '/permissions',
			templateUrl: 'modules/permissions/views/list-permissions.client.view.html'
		}).
		state('createPermission', {
			url: '/permissions/create',
			templateUrl: 'modules/permissions/views/create-permission.client.view.html'
		}).
		state('viewPermission', {
			url: '/permissions/:permissionId',
			templateUrl: 'modules/permissions/views/view-permission.client.view.html'
		}).
		state('editPermission', {
			url: '/permissions/:permissionId/edit',
			templateUrl: 'modules/permissions/views/edit-permission.client.view.html'
		});
	}
]);