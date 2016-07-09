'use strict';
angular.module('main', [
	'ionic',
	'ngCordova',
	'ui.router',
	'LocalForageModule',
	'ion-autocomplete',
	'angular-svg-round-progressbar',
	'ionic-lock-screen'
	// TODO: load other modules selected during generation
])
	.config(function ($stateProvider, $urlRouterProvider) {

		// ROUTING with ui.router
		$urlRouterProvider.otherwise('/main/home');
		$stateProvider
		// this state is placed in the <ion-nav-view> in the index.html
			.state('main', {
				url: '/main',
				abstract: true,
				templateUrl: 'main/templates/menu.html',
				controller: 'MenuCtrl as menu'
			})
			.state('main.home', {
				url: '/home',
				views: {
					'pageContent': {
						templateUrl: 'main/templates/home.html',
						controller: 'HomeCtrl'
					}
				}
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
			})
			.state('main.subjectsOverview', {
				url: '/subjectsOverview/:id',
				views: {
					'pageContent': {
						templateUrl: 'main/templates/subjects-overview.html',
						controller: 'SubjectsOverviewCtrl'
					}
				}
			});
	})
	.run(function ($ionicPlatform, $lockScreen, DataStore) {
		$ionicPlatform.ready(function () {
			DataStore('me').load('me').then(function (me) {
				if (me && me.passcode) {
					$lockScreen.show({
						ACDelbuttons: true,
						code: me.passcode,
						touchId: true
					});
				}
			});
		});
	});
