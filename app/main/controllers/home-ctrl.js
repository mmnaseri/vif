'use strict';
angular.module('main')
	.controller('HomeCtrl', function (Sessions, $scope) {
		$scope.active = {};
		$scope.$on('$ionicView.beforeEnter', function () {
			Sessions.active($scope.active);
		});
		$scope.getStyle = function () {
			var transform = 'translateY(-50%) translateX(-50%)';
			return {
				'top': '50%',
				'bottom': 'auto',
				'left': '50%',
				'transform': transform,
				'-moz-transform': transform,
				'-webkit-transform': transform,
				'font-size': '35.714285714285715px'
			};
		};
	});
