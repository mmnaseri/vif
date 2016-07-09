'use strict';
angular.module('main')
	.controller('SubjectsAddCtrl', function (SubjectsService, $scope, $state) {
		$scope.$on('$ionicView.enter', function () {
			$scope.subjects = [];
			SubjectsService.load($scope.subjects);
			$scope.subject = {
				dependencies: []
			};
			$scope.add = function () {
				SubjectsService.add($scope.subject).then(function () {
					$state.go('main.subjects');
				});
			};
			$scope.bindDependency = function (other) {
				$scope.subject.dependencies = $scope.subject.dependencies || [];
				var found = -1;
				angular.forEach($scope.subject.dependencies, function (dependency, index) {
					if (dependency.$id === other.$id) {
						found = index;
					}
				});
				if (found === -1 && other.$selected) {
					$scope.subject.dependencies.push(other);
				} else if (found > -1 && !other.$selected) {
					$scope.subject.dependencies.splice(found, 1);
				}
			};
		});
	});
