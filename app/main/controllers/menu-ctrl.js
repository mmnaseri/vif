'use strict';
angular.module('main')
	.controller('MenuCtrl', function (Sessions, $interval, Recuperation) {
		$interval(function () {
			Sessions.tick();
			Recuperation.tick();
		}, 1000);
	});
