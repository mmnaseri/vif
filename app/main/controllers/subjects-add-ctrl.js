'use strict';
angular.module('main')
	.controller('SubjectsAddCtrl', function (SubjectsModifyCtrl, SubjectsService, $scope, $state, $ionicModal) {
		SubjectsModifyCtrl(SubjectsService, $scope, $state, $ionicModal);
		$scope.save = function () {
			SubjectsService.add($scope.subject).then(function () {
				$state.go('main.subjects');
			});
		};
	});
