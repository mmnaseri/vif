'use strict';

describe('module: main, controller: PointsCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var PointsCtrl;
	beforeEach(inject(function ($controller) {
		PointsCtrl = $controller('PointsCtrl');
	}));

	it('should do something', function () {
		expect(!!PointsCtrl).toBe(true);
	});

});
