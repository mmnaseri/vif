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
		this.start = function (length, subject, topic) {
			var milliseconds = length * 60 * 1000;
			return repository.save({
				subject: subject,
				topic: topic.$index,
				active: true,
				running: true,
				createDate: Date.now(),
				length: milliseconds, //convert to milliseconds
				remaining: milliseconds
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
		this.cancel = function (session) {
			session.running = false;
			session.active = false;
			session.note = 'Cancelled';
			return repository.save(session);
		};
	});
