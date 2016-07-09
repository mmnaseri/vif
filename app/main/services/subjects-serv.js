'use strict';
angular.module('main')
	.service('SubjectsService', function (DataStore) {
		var subjects = DataStore('subjects');
		this.load = function (all) {
			all.length = 0;
			subjects.all().then(function (entities) {
				angular.forEach(entities, function (entity) {
					all.push(entity);
				});
			});
		};
		this.add = function (subject) {
			delete subject.$id;
			return subjects.save(subject);
		};
	});
