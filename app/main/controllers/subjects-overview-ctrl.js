'use strict';
angular.module('main')
	.controller('SubjectsOverviewCtrl', function ($scope, SubjectsService, $stateParams, $ionicActionSheet, $ionicModal, Sessions, $state) {
		$scope.subject = {};
		var refresh = function () {
			SubjectsService.get($stateParams.id).then(function (subject) {
				Sessions.all().where(function (session) {
					return session.subject && session.subject.$id === subject.$id;
				}).then(function (sessions) {
					angular.forEach(subject.topics, function (topic, index) {
						topic.$index = index;
						angular.forEach(sessions, function (session) {
							if (session.topic === index) {
								topic.session = session;
								if (session.active && session.running) {
									topic.status = 'active';
								} else if (session.active) {
									topic.status = 'paused';
								} else {
									topic.status = topic.done ? 'done' : 'fresh';
								}
							} else {
								topic.status = topic.done ? 'done' : 'fresh';
							}
						});
					});
					$scope.subject = subject;
				});
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
		var topicSession = function (topic) {
			return {
				start: function () {
					$scope.selectedTopic = topic;
					sessionStarModal.show();
				},
				restart: function () {
					var hide = $ionicActionSheet.show({
						buttons: [],
						destructiveText: 'Restart topic',
						titleText: 'Are you sure that you want to restart this topic and lose any study points you might have accumulated?',
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
				},
				resume: function () {
					var hide = $ionicActionSheet.show({
						buttons: [
							{
								text: 'Resume session'
							}
						],
						titleText: 'This session is paused with ' + $scope.getTime(topic.session.remaining) + ' remaining. Are you sure that you want to resume this session?',
						cancelText: 'Cancel',
						buttonClicked: function () {
							var resumeSession = function () {
								Sessions.resume(topic.session).then(function () {
									hide();
									refresh();
								}, function () {
									hide();
									var hideSecond = $ionicActionSheet.show({
										buttons: [],
										destructiveText: 'End the other session',
										titleText: 'There is another session in progress. Do you want to end that session?',
										cancelText: 'Cancel',
										destructiveButtonClicked: function () {
											Sessions.cancel(session).then(function () {
												resumeSession();
												hideSecond();
											});
										}
									});
								});
							};
							resumeSession();
						}
					});
				},
				pauseOrStop: function () {
					var hide = $ionicActionSheet.show({
						buttons: [
							{
								text: 'Pause session'
							}
						],
						destructiveText: 'End session',
						titleText: 'This session is currently active. Do you want to pause or end the session?',
						cancelText: 'Cancel',
						destructiveButtonClicked: function () {
							Sessions.cancel(topic.session).then(function () {
								hide();
								refresh();
							});
						},
						buttonClicked: function () {
							Sessions.pause(topic.session).then(function () {
								hide();
								refresh();
							});
						}
					});

				}
			};
		};
		$scope.topicSession = function (topic) {
			var session = topicSession(topic);
			switch (topic.status) {
				case 'fresh':
					session.start();
					break;
				case 'done':
					session.restart();
					break;
				case 'active':
					session.pauseOrStop();
					break;
				case 'paused':
					session.resume();
					break;
			}
		};
		$scope.closeModal = function () {
			sessionStarModal.hide();
		};
		$scope.$on('$destroy', function () {
			sessionStarModal.remove();
		});
		$scope.beginSession = function (minutes) {
			console.log('beginning ' + minutes);
			Sessions.start(minutes, $scope.subject, $scope.selectedTopic).then(function () {
				console.log('started the session');
				$scope.subject.started = true;
				$scope.selectedTopic.done = false;
				$scope.selectedTopic.earned = 0;
				SubjectsService.save($scope.subject).then(function () {
					console.log('saved the subject');
					$scope.closeModal();
					$state.go('main.home');
				});
			}, function (session) {
				var hide = $ionicActionSheet.show({
					buttons: [],
					destructiveText: 'End the other session',
					titleText: 'There is another session in progress. Do you want to end that session?',
					cancelText: 'Cancel',
					destructiveButtonClicked: function () {
						Sessions.cancel(session).then(function () {
							$scope.beginSession(minutes);
							hide();
						});
					}
				});
			});
		};
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
