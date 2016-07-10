'use strict';

describe('module: main, service: Sessions', function () {

	// load the service's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate service
	var Sessions;
	beforeEach(inject(function (_Sessions_) {
		Sessions = _Sessions_;
	}));

	it('should do something', function () {
		expect(!!Sessions).toBe(true);
	});

});
