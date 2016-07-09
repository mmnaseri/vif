'use strict';
angular.module('main')
	.service('SubjectsService', function ($localForage) {
		this.load = function (all) {
			all.length = 0;
			$localForage.getItem('subjects').then(function (subjects) {
				angular.forEach(subjects, function (subject) {
					all.push(subject);
				});
			});
		};
		this.add = function (subject) {
			var insert = function (subjects) {
				subjects.push(subject);
				$localForage.setItem('subjects', subjects);
			};
			$localForage.getItem('subjects').then(insert, function () {
				$localForage.setItem('subjects', []).then(function () {
					insert([]);
				});
			});
		};
	});
