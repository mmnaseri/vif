'use strict';
angular.module('main').service('FocusHealth', function (DataStore, $q) {
	var $this = this;
	var modes = this.modes = {
		RESTING: 'RESTING',
		STUDYING: 'STUDYING'
	};
	var functions = {
		studying: function (duration) {
			return 25 - 0.007 * Math.pow(duration, 2) - (0.05 * duration) - (2 * Math.sqrt(180 - Math.min(duration, 179)));
		},
		resting: function (duration) {
			return Math.pow((2 - Math.atan(duration)), 2) * duration * Math.log(1 + duration);
		},
		none: function () {
			return 0;
		}
	};
	var dataStore = DataStore('focus');
	var mode = modes.RESTING;
	dataStore.count().then(function (count) {
		if (count === 0) {
			var start = {
				mode: mode,
				timestamp: Date.now(),
				level: 100,
				peak: 100
			};
			start.start = start.timestamp;
			dataStore.save(start);
		}
	});
	this.mode = function () {
		var deferred = $q.defer();
		var old = mode;
		if (arguments.length === 1) {
			console.log('mode change requested from ' + mode + ' to ' + arguments[0]);
			mode = arguments[0];
		}
		if (mode !== modes.RESTING && mode !== modes.STUDYING) {
			mode = modes.RESTING;
		}
		if (mode === old) {
			console.log('mode is the same, quitting.');
			deferred.resolve(mode);
		} else {
			console.log('mode changed: ' + mode);
			dataStore.all().orderBy('createDate').last().then(function (focus) {
				delete focus.$id;
				delete focus.createDate;
				delete focus.modifiedDate;
				focus.timestamp = Date.now();
				focus.start = focus.timestamp;
				focus.peak = focus.level;
				focus.mode = mode;
				dataStore.save(focus).then(function () {
					deferred.resolve(mode);
				}, deferred.reject);
			});
		}
		return deferred.promise;
	};
	var adjust = function (focus) {
		var timestamp = Date.now();
		var minute = 60000 / 60;
		if (timestamp - focus.timestamp < minute) {
			return;
		}
		if (focus.mode === modes.RESTING && focus.level >= 100 || focus.mode === modes.STUDYING && focus.level <= 0) {
			return;
		}
		var duration = Math.floor((timestamp - focus.start) / minute);
		var fn;
		if (focus.mode === modes.STUDYING) {
			fn = functions.studying;
		} else if (focus.mode === modes.RESTING) {
			fn = functions.resting;
		} else {
			fn = functions.none;
		}
		var adjustment = fn(duration);
		if (adjustment !== 0) {
			var current = {
				mode: focus.mode,
				timestamp: timestamp,
				level: Math.floor(Math.min(100, Math.max(0, focus.peak + adjustment))),
				peak: focus.peak,
				start: focus.start
			};
			if (current.level !== focus.level) {
				return dataStore.save(current);
			}
		}
	};
	this.tick = function () {
		return dataStore.all().orderBy('createDate').last().then(function (focus) {
			if (!focus) {
				return;
			}
			if (focus.mode === modes.STUDYING) {
				DataStore('sessions').all().where({
					active: true,
					running: true
				}).then(function (sessions) {
					if (!sessions.length) {
						$this.mode(modes.RESTING).then(function () {
							adjust(focus);
						});
					} else {
						adjust(focus);
					}
				});
			} else {
				adjust(focus);
			}
		});
	};
	this.all = function () {
		return dataStore.all();
	};
});
