'use strict';
angular.module('main')
	.controller('SubjectsCtrl', function ($scope, SubjectsService, $ionicActionSheet) {
		$scope.subjects = [];
		var refresh = function () {
			SubjectsService.load($scope.subjects).then(function () {
				angular.forEach($scope.subjects, function (subject) {
					subject.points = 0;
					angular.forEach(subject.topics || [], function (topic) {
						subject.points += topic.points;
					});
				});
			});
		};
		$scope.$on('$ionicView.beforeEnter', refresh);
		$scope.remove = function (subject) {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'Delete',
				titleText: 'Are you sure that you want to delete this subject and all of its history?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					SubjectsService.remove(subject).then(refresh);
					hide();
				}
			});

		};
	});
