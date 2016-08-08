'use strict';

describe('module: main, controller: HealthCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var HealthCtrl;
	beforeEach(inject(function ($controller) {
		HealthCtrl = $controller('HealthCtrl');
	}));

	it('should do something', function () {
		expect(!!HealthCtrl).toBe(true);
	});

});
