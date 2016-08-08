'use strict';
angular.module('main').service('Points', function (DataStore) {

	var dataStore = DataStore('points');

	this.earn = function (session) {
		return dataStore.save({
			amount: session.subject.topics[session.topic].points,
			session: session
		});
	};

	this.remove = function (session) {
		return dataStore.all().where({
			session: {
				$id: session.$id
			}
		}).remove();
	};

	this.all = function () {
		return dataStore.all();
	};

});
