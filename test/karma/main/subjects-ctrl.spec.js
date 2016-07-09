'use strict';

describe('module: main, controller: SubjectsCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SubjectsCtrl;
	beforeEach(inject(function ($controller) {
		SubjectsCtrl = $controller('SubjectsCtrl');
	}));

	it('should do something', function () {
		expect(!!SubjectsCtrl).toBe(true);
	});

});
