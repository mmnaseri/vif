'use strict';

describe('module: main, controller: SubjectsOverviewCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SubjectsOverviewCtrl;
	beforeEach(inject(function ($controller) {
		SubjectsOverviewCtrl = $controller('SubjectsOverviewCtrl');
	}));

	it('should do something', function () {
		expect(!!SubjectsOverviewCtrl).toBe(true);
	});

});
