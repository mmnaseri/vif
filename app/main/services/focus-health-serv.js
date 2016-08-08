'use strict';
angular.module('main').service('FocusHealth', function (DataStore) {
	var dataStore = DataStore('focus');
	var mode = 'RESTING';
	dataStore.count().then(function (count) {
		if (count === 0) {
			dataStore.save({
				mode: mode,
				timestamp: Date.now(),
				level: 100
			});
		}
	});
	this.mode = function () {
		if (arguments.length === 1) {
		} else {
			mode = arguments[0];
		}
		if (mode !== 'RESTING' && mode !== 'STUDYING') {
			mode = 'RESTING';
		}
		return mode;
	};
	this.tick = function () {
		dataStore.all().orderBy('createDate').last().then(function (focus) {
			console.log(focus);
		});
	};
});
