'use strict';
angular.module('main')
	.controller('MenuCtrl', function ($interval, Sessions, Recuperation, FocusHealth) {
		$interval(function () {
			Sessions.tick();
			Recuperation.tick();
			FocusHealth.tick();
		}, 1000);
	});
