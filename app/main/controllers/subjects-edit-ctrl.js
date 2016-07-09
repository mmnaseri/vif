'use strict';
angular.module('main')
	.controller('SubjectsEditCtrl', function (SubjectsModifyCtrl, $scope, SubjectsService, $stateParams, $state, $ionicModal) {
		SubjectsModifyCtrl(SubjectsService, $scope, $state, $ionicModal);
		$scope.beforeEnter = function () {
			angular.forEach($scope.subjects, function (subject, index) {
				if (subject.$id === $stateParams.id) {
					$scope.subjects.splice(index, 1);
				}
			});
			SubjectsService.get($stateParams.id).then(function (subject) {
				$scope.subject = subject;
				angular.forEach(subject.dependencies || [], function (depenency) {
					angular.forEach($scope.subjects, function (other) {
						if (other.$id === depenency.$id) {
							other.$selected = true;
						}
					});
				});
			});
		};
		$scope.save = function () {
			SubjectsService.save($scope.subject).then(function () {
				$state.go('main.subjects');
			});
		};
	});
