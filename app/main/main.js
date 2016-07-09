'use strict';
angular.module('main', [
	'ionic',
	'ngCordova',
	'ui.router',
	'LocalForageModule',
	'ion-autocomplete'
	// TODO: load other modules selected during generation
])
	.config(function ($stateProvider, $urlRouterProvider) {

		// ROUTING with ui.router
		$urlRouterProvider.otherwise('/main/subjects');
		$stateProvider
		// this state is placed in the <ion-nav-view> in the index.html
			.state('main', {
				url: '/main',
				abstract: true,
				templateUrl: 'main/templates/menu.html',
				controller: 'MenuCtrl as menu'
			})
			.state('main.subjects', {
				url: '/subjects',
				views: {
					'pageContent': {
						templateUrl: 'main/templates/subjects.html',
						controller: 'SubjectsCtrl'
					}
				}
			})
			.state('main.subjectsAdd', {
				url: '/subjectsAdd',
				views: {
					'pageContent': {
						templateUrl: 'main/templates/subjects-edit.html',
						controller: 'SubjectsAddCtrl'
					}
				}
			})
			.state('main.subjectsEdit', {
				url: '/subjectsEdit/:id',
				views: {
					'pageContent': {
						templateUrl: 'main/templates/subjects-edit.html',
						controller: 'SubjectsEditCtrl'
					}
				}
			});
	});
