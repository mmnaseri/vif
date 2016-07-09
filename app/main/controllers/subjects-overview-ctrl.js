'use strict';
angular.module('main')
	.controller('SubjectsOverviewCtrl', function ($scope, SubjectsService, $stateParams, $ionicActionSheet, $ionicModal) {
		$scope.subject = {};
		var refresh = function () {
			SubjectsService.get($stateParams.id).then(function (subject) {
				$scope.subject = subject;
			});
		};
		$scope.$on('$ionicView.beforeEnter', refresh);
		var sessionStarModal;
		$ionicModal.fromTemplateUrl('start-topic-session.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			sessionStarModal = modal;
		});
		$scope.restartTopic = function (topic) {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'Restart topic',
				titleText: 'Are you sure that you want to restart this topic and lose any study points you might have acquired?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					var totalEarned = 0;
					var started = false;
					topic.done = false;
					//todo if anything was earned, we have to remove it
					topic.earned = 0;
					angular.forEach($scope.subject.topics, function (topic) {
						totalEarned += topic.earned || 0;
						started = topic.done;
					});
					started = started || totalEarned > 0;
					$scope.subject.started = started;
					SubjectsService.save($scope.subject).then(refresh);
					hide();
				}
			});
		};
		$scope.startSession = function (topic) {
			$scope.selectedTopic = topic;
			sessionStarModal.show();
		};
		$scope.closeModal = function () {
			sessionStarModal.hide();
		};
		$scope.$on('$destroy', function () {
			sessionStarModal.remove();
		});
		$scope.markDone = function () {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'Mark as done',
				titleText: 'By marking a topic as done, you will not earn any study points. Are you sure?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					$scope.subject.started = true;
					$scope.selectedTopic.done = true;
					$scope.selectedTopic.earned = 0;
					SubjectsService.save($scope.subject).then(refresh);
					hide();
					$scope.closeModal();
				}
			});
		};
	});
