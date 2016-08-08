'use strict';

describe('module: main, service: Focus-health', function () {

	// load the service's module
	beforeEach(module('main'));
	// load all the templates to prevent unexpected $http requests from ui-router
	beforeEach(module('ngHtml2Js'));

	// instantiate service
	var FocusHealth;
	beforeEach(inject(function (_FocusHealth_) {
		FocusHealth = _FocusHealth_;
	}
	))
	;

	it('should do something', function () {
		expect(!!FocusHealth).toBe(true);
	});

});
