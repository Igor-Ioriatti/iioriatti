'use strict';

//Permissions service used to communicate Permissions REST endpoints
angular.module('permissions').factory('Permissions', ['$resource',
	function($resource) {
		return $resource('permissions/:permissionId', { permissionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);