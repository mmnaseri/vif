'use strict';
angular.module('main')
	.service('Sessions', function (DataStore, $q) {
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
				return repository.save({
					subject: subject,
					topic: topic.$index,
					active: true,
					running: true,
					createDate: Date.now(),
					length: milliseconds, //convert to milliseconds
					remaining: milliseconds,
					rest: rest
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
					session.remaining = Math.max(0, session.remaining - 1000);
					if (session.remaining === 0) {
						session.running = false;
						session.active = false;
					}
					promises.push(repository.save(session));
				});
				$q.all(promises).then(deferred.resolve, deferred.reject);
			}, deferred.reject);
			return deferred.promise;
		};
		this.pause = function (session) {
			session.running = false;
			return repository.save(session);
		};
		this.resume = function (session) {
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
				return repository.save(session);
			});
		};
		this.cancel = function (session) {
			session.running = false;
			session.active = false;
			session.note = 'Cancelled';
			return repository.save(session);
		};
		this.all = function () {
			return repository.all();
		};
		this.remove = function (session) {
			return repository.remove(session);
		};
	});
