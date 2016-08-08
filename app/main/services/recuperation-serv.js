'use strict';
angular.module('main').service('Recuperation', function (DataStore, $q) {
	var dataStore = DataStore('health');
	this.rest = function (length) {
		return dataStore.all().where({
			active: true
		}).remove().then(function () {
			return dataStore.save({
				remaining: length,
				length: length,
				active: true
			});
		});
	};
	this.tick = function () {
		dataStore.all().where({
			active: true
		}).then(function (rests) {
			var promises = [];
			angular.forEach(rests, function (rest) {
				var progress = Math.round((rest.modifiedDate ? (Date.now() - rest.modifiedDate) : 1000) / 1000) * 1000;
				rest.remaining = Math.max(0, rest.remaining - progress);
				if (rest.remaining <= 0) {
					rest.active = false;
				}
				promises.push(dataStore.save(rest));
			});
			return $q.all(promises);
		});
	};
	this.resting = function () {
		return dataStore.all().where({
			active: true
		}).then(function (active) {
			return active.length !== 0;
		});
	};
	this.active = function (active) {
		return dataStore.all().where(function (item) {
			return item.active === true;
		}).first().then(function (session) {
			angular.forEach(active, function (value, property) {
				delete active[property];
			});
			if (session) {
				angular.forEach(session, function (value, property) {
					active[property] = value;
				});
			}
			return session;
		});
	};
});
