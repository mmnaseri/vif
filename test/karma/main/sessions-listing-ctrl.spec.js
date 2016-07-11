'use strict';

describe('module: main, controller: SessionsListingCtrl', function () {

	// load the controller's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate controller
	var SessionsListingCtrl;
	beforeEach(inject(function ($controller) {
		SessionsListingCtrl = $controller('SessionsListingCtrl');
	}));

	it('should do something', function () {
		expect(!!SessionsListingCtrl).toBe(true);
	});

});
