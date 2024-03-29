'use strict';
angular.module('main')
	.service('Sessions', function (DataStore, $q, Points, Recuperation, FocusHealth) {
		var repository = DataStore('sessions');
		this.active = function (active) {
			return repository.all().where(function (item) {
				return item.active === true && item.running === true;
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
		this.paused = function (paused) {
			return repository.all().where(function (item) {
				return item.active === true && item.running === false;
			}).then(function (sessions) {
				var toBeDeleted = [];
				var toBeAdded = [];
				angular.forEach(sessions, function (session, index) {
					var found = false;
					angular.forEach(paused, function (oldSession) {
						if (session.$id === oldSession.$id) {
							found = true;
						}
					});
					if (!found) {
						toBeAdded.push(index);
					}
				});
				angular.forEach(paused, function (oldSession, index) {
					var found = false;
					angular.forEach(sessions, function (session) {
						if (session.$id === oldSession.$id) {
							found = true;
						}
					});
					if (!found) {
						toBeDeleted.push(index);
					}
				});
				var i;
				for (i = toBeDeleted.length - 1; i >= 0; i --) {
					paused.splice(toBeDeleted[i], 1);
				}
				for (i = 0; i < toBeAdded.length; i ++) {
					paused.push(sessions[toBeAdded[i]]);
				}
				if (toBeDeleted.length + toBeDeleted.length > 0) {
					paused.sort(function (first, second) {
						return first.createdDate - second.createDate;
					});
				}
				return sessions;
			});
		};
		this.start = function (length, subject, topic, rest) {
			return Recuperation.resting().then(function (resting) {
				if (resting) {
					throw new Error('Cannot start a session when you are supposed to be resting');
				}
				rest = rest || Math.floor(length * length / 153 + 2);
				var deferred = $q.defer();
				repository.all().where(function (item) {
					return item.active === true && item.running === true;
				}).first().then(function (session) {
					if (!session) {
						deferred.resolve();
					} else {
						deferred.reject(session);
					}
				});
				return deferred.promise.then(function () {
					var milliseconds = length * 60 * 1000;
					return FocusHealth.mode(FocusHealth.modes.STUDYING).then(function () {
						return repository.save({
							subject: subject,
							topic: topic.$index,
							active: true,
							running: true,
							length: milliseconds, //convert to milliseconds
							remaining: milliseconds,
							rest: rest * 60 * 1000
						});
					});
				});
			});
		};
		this.tick = function () {
			var deferred = $q.defer();
			repository.all().where(function (item) {
				return item.active === true && item.running === true;
			}).then(function (running) {
				var promises = [];
				angular.forEach(running, function (session) {
					var progress = Math.round((session.modifiedDate ? (Date.now() - session.modifiedDate) : 1000) / 1000) * 1000;
					session.remaining = Math.max(0, session.remaining - progress);
					if (session.remaining === 0) {
						session.running = false;
						session.active = false;
						promises.push(Points.earn(session));
						promises.push(Recuperation.rest(session.rest));
						promises.push(FocusHealth.mode(FocusHealth.modes.RESTING));
					}
					promises.push(repository.save(session));
				});
				$q.all(promises).then(deferred.resolve, deferred.reject);
			}, deferred.reject);
			return deferred.promise;
		};
		this.pause = function (session) {
			session.running = false;
			return FocusHealth.mode(FocusHealth.modes.RESTING).then(function () {
				return repository.save(session);
			});
		};
		this.resume = function (session) {
			return Recuperation.resting().then(function (resting) {
				if (resting) {
					throw new Error('Cannot resume a session when you are supposed to be resting');
				}
				var deferred = $q.defer();
				repository.all().where(function (item) {
					return item.active === true && item.running === true;
				}).first().then(function (session) {
					if (!session) {
						deferred.resolve();
					} else {
						deferred.reject(session);
					}
				});
				return deferred.promise.then(function () {
					session.running = true;
					return FocusHealth.mode(FocusHealth.modes.STUDYING).then(function () {
						return repository.save(session);
					});
				});
			});
		};
		this.cancel = function (session) {
			session.running = false;
			session.active = false;
			session.note = 'Cancelled';
			return FocusHealth.mode(FocusHealth.modes.RESTING).then(function () {
				return repository.save(session);
			});
		};
		this.all = function () {
			return repository.all();
		};
		this.remove = function (session) {
			return Points.remove(session).then(function () {
				return repository.remove(session);
			});
		};
	});
