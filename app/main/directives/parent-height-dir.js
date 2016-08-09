'use strict';
angular.module('main')
	.directive('parentHeight', function () {
		return {
			restrict: 'A',
			link: function (scope, element) {
				var height = element.parent()[0].offsetHeight;
				element.attr('height', height * 3 / 4);
			}
		};
	});
