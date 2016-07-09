'use strict';

describe('module: main, controller: Subjects-addCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SubjectsAddCtrl;
	beforeEach(inject(function ($controller) {
		SubjectsAddCtrl = $controller('SubjectsAddCtrl');
	}));

	it('should do something', function () {
		expect(!!SubjectsAddCtrl).toBe(true);
	});

});
