'use strict';
angular.module('main')
	.directive('square', function () {
		return {
			template: '<div class="square-container"><div class="square-before"></div><div class="square" ng-transclude=""></div></div>',
			transclude: true,
			restrict: 'E',
			link: function () {

			}
		};
	});
