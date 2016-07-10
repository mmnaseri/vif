'use strict';
angular.module('main')
	.controller('HomeCtrl', function (Sessions, $scope, $interval, $ionicActionSheet) {
		var pad = function (num) {
			if ((num + '').length < 2) {
				return '0' + num;
			}
			return num + '';
		};
		$scope.active = {};
		$scope.paused = [];
		var refresh = function () {
			Sessions.active($scope.active);
			Sessions.paused($scope.paused);
		};
		$scope.$on('$ionicView.beforeEnter', refresh);
		$scope.getStyle = function () {
			var transform = 'translateY(-50%) translateX(-50%)';
			return {
				'top': '50%',
				'bottom': 'auto',
				'left': '50%',
				'transform': transform,
				'-moz-transform': transform,
				'-webkit-transform': transform,
				'font-size': '35.714285714285715px'
			};
		};
		$scope.getTime = function (remaining) {
			var seconds = remaining / 1000;
			var minutes = Math.floor(seconds / 60);
			seconds = seconds % 60;
			return pad(minutes) + ':' + pad(seconds);
		};
		$scope.pauseSession = function () {
			Sessions.pause($scope.active).then(refresh);
		};
		$scope.cancelSession = function (session) {
			var hide = $ionicActionSheet.show({
				buttons: [],
				destructiveText: 'End Session',
				titleText: 'Are you sure that you want to end the session and lose your current progress?',
				cancelText: 'Cancel',
				destructiveButtonClicked: function () {
					Sessions.cancel(session).then(refresh);
					hide();
				}
			});
		};
		$scope.resumeSession = function (session) {
			var hide = $ionicActionSheet.show({
				buttons: [
					{
						text: 'Resume'
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
		$interval(function () {
			refresh();
		}, 1000);
	});
