'use strict';
angular.module('main')
	.service('Sessions', function (DataStore) {
		var repository = DataStore('sessions');
		this.active = function (active) {
			return repository.all().where(function (item) {
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
		this.start = function (length, subject, topic) {
			return repository.save({
				subject: subject,
				topic: topic.$index,
				active: true,
				createDate: Date.now(),
				length: length * 60 * 1000, //convert to milliseconds
				done: 0
			});
		};
	});
