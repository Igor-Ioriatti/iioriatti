'use strict';

// Configuring the Articles module
angular.module('permissions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Permissions', 'permissions', 'dropdown', '/permissions(/create)?');
		Menus.addSubMenuItem('topbar', 'permissions', 'List Permissions', 'permissions');
		Menus.addSubMenuItem('topbar', 'permissions', 'New Permission', 'permissions/create');
	}
]);