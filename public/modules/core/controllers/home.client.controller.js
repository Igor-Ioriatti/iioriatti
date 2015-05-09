'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Articles',
	function($scope, Authentication, Articles) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		console.log('Atricles : '+ Articles);

		$scope.alerts = [
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 1'
			},
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 2'
			},
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 3'
			},
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 4'
			},
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 5'
			},
			{icon:'glyphicon glyphicon-qrcode',
				color:'btn-success',
				total:'322',
				description:'alert 6'
			}
		];

		$scope.find = function() {
			$scope.articles = Articles.query();
		};
	}
]);
