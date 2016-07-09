'use strict';
angular.module('main')
	.factory('SubjectsModifyCtrl', function () {
		return function (SubjectsService, $scope, $state, $ionicModal) {
			$scope.subjects = [];
			$scope.$on('$ionicView.beforeEnter', function () {
				$scope.subject = {
					dependencies: [],
					topics: []
				};
				$scope.view = {
					dependencies: false
				};
				SubjectsService.load($scope.subjects).then(function () {
					if ($scope.beforeEnter) {
						$scope.beforeEnter();
					}
				});
			});
			$scope.$on('$ionicView.afterLeave', function () {
				$scope.subject = {
					dependencies: [],
					topics: []
				};
			});
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
			$ionicModal.fromTemplateUrl('edit-topics-modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.editTopicsModal = modal;
			});
			$scope.editTopics = function () {
				$scope.newTopic = {
					title: '',
					points: ''
				};
				$scope.subject.topics = $scope.subject.topics || [];
				$scope.editTopicsModal.show();
			};
			$scope.closeModal = function () {
				$scope.editTopicsModal.hide();
			};
			$scope.$on('$destroy', function () {
				$scope.editTopicsModal.remove();
			});
			$scope.moveItem = function (item, fromIndex, toIndex) {
				$scope.subject.topics.splice(fromIndex, 1);
				$scope.subject.topics.splice(toIndex, 0, item);
			};
		};
	});
