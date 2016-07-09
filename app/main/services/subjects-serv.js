'use strict';
angular.module('main')
	.service('SubjectsService', function (DataStore, $q) {
		var subjects = DataStore('subjects');
		this.load = function (all) {
			all.length = 0;
			return subjects.all().then(function (entities) {
				angular.forEach(entities, function (entity) {
					all.push(entity);
				});
			});
		};
		this.add = function (subject) {
			delete subject.$id;
			return subjects.save(subject);
		};
		this.save = function (subject) {
			if (!angular.isString(subject.$id)) {
				return;
			}
			return subjects.save(subject);
		};
		this.remove = function (subject) {
			var promises = [];
			subjects.all().then(function (allSubjects) {
				angular.forEach(allSubjects, function (other) {
					var modified = false;
					angular.forEach(other.dependencies || [], function (dependency, index) {
						if (!modified && dependency.$id === subject.$id) {
							other.dependencies.splice(index, 1);
							modified = true;
						}
					});
					if (modified) {
						promises.push(subjects.save(other));
					}
				});
			});
			return $q.all(promises).then(function () {
				return subjects.remove(subject);
			});
		};
		this.get = function (id) {
			return subjects.load(id);
		};
	});
