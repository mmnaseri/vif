'use strict';

describe('module: main, controller: SubjectsEditCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SubjectsEditCtrl;
	beforeEach(inject(function ($controller) {
		SubjectsEditCtrl = $controller('SubjectsEditCtrl');
	}));

	it('should do something', function () {
		expect(!!SubjectsEditCtrl).toBe(true);
	});

});
