'use strict';

describe('module: main, service: Points', function () {

	// load the service's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate service
	var Points;
	beforeEach(inject(function (_Points_) {
		Points = _Points_;
	}));

	it('should do something', function () {
		expect(!!Points).toBe(true);
	});

});
