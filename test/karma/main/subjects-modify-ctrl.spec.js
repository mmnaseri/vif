'use strict';

describe('module: main, controller: SubjectsModifyCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SubjectsModifyCtrl;
	beforeEach(inject(function ($controller) {
		SubjectsModifyCtrl = $controller('SubjectsModifyCtrl');
	}));

	it('should do something', function () {
		expect(!!SubjectsModifyCtrl).toBe(true);
	});

});
