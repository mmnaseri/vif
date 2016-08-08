'use strict';
angular.module('main')
	.controller('MenuCtrl', function (Sessions, $interval, FocusHealth) {
		$interval(function () {
			Sessions.tick();
			FocusHealth.tick();
		}, 1000);
	});
