'use strict';

describe('module: main, service: Subjects', function () {

	// load the service's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate service
	var Subjects;
	beforeEach(inject(function (_SubjectsService_) {
		Subjects = _SubjectsService_;
	}));

	it('should do something', function () {
		expect(!!Subjects).toBe(true);
	});

});
