'use strict';

describe('module: main, service: DataStore', function () {

	// load the service's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate service
	var DataStore;
	beforeEach(inject(function (_DataStore_) {
		DataStore = _DataStore_;
	}));

	it('should do something', function () {
		expect(!!DataStore).toBe(true);
	});

});
