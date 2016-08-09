'use strict';
angular.module('main')
	.controller('MenuCtrl', function ($interval, Sessions, Recuperation, FocusHealth) {
		$interval(function () {
			Sessions.tick()
				.then(function () {
					return Recuperation.tick();
				})
				.then(function () {
					return FocusHealth.tick();
				});
		}, 1000);
	});
