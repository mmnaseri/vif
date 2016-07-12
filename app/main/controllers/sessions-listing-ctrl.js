'use strict';
angular.module('main')
	.controller('SessionsListingCtrl', function (Sessions, $scope, $ionicActionSheet) {
		$scope.active = {};
		$scope.sessions = [];
		var refresh = function () {
			var timestampToDate = function (timestamp) {
				var date = new Date(timestamp);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			};
			Sessions.active($scope.active);
			Sessions.all().where({
				running: false
			}).groupBy('createDate', timestampToDate).then(function (result) {
				result.$keys.sort(function (a, b) {
					return b > a;
				});
				angular.forEach(result, function (list, date) {
					if (date === '$keys') {
						return;
					}
					list.sort(function (a, b) {
						return b.createDate - a.createDate;
					});
				});
				$scope.groupedSessions = result;
			});
		};
		$scope.$on('$ionicView.enter', refresh);
		var removeSession = function (session) {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'Delete',
				titleText: 'Are you sure that you want to delete this session and any points you have gained through it?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					Sessions.remove(session).then(refresh);
					hide();
				}
			});
		};
		var endSession = function (session) {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'End',
				titleText: 'Are you sure that you want to end this session and lose your current progress?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					Sessions.cancel(session).then(refresh);
					hide();
				}
			});
		};
		$scope.end = function (session) {
			if (!session.active) {
				removeSession(session);
			} else {
				endSession(session);
			}
		};
		$scope.pause = function (session) {
			Sessions.pause(session).then(refresh);
		};
		$scope.resume = function (session) {
			var hide = $ionicActionSheet.show({
				buttons: [
					{
						text: 'Resume session'
					}
				],
				titleText: 'Resume this session?',
				cancelText: 'Cancel',
				buttonClicked: function () {
					Sessions.resume(session).then(refresh);
					hide();
				}
			});
		};
	});
