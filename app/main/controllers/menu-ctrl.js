'use strict';
angular.module('main')
	.controller('MenuCtrl', function (Sessions, $interval) {
		$interval(function () {
			Sessions.tick();
		}, 1000);
	});
