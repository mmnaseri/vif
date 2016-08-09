'use strict';
angular.module('main').controller('HealthCtrl', function (FocusHealth, $scope, $interval, $filter) {
	var date = $filter('date');
	$scope.data = [];
	$scope.labels = [];
	$scope.options = {
		scales: {
			yAxes: [
				{
					type: 'linear',
					position: 'left',
					ticks: {
						stepSize: 20,
						min: 0,
						max: 100
					}
				}
			]
		}
	};
	var refresh = $scope.refresh = function () {
		var result = [];
		var labels = [];
		$scope.data = [result];
		$scope.labels = labels;
		FocusHealth.all().orderBy('timestamp').then(function (data) {
			angular.forEach(data, function (item) {
				if (!item) {
					return;
				}
				result.push(item.level);
				labels.push(date(item.timestamp, 'HH:mm'));
			});
		});
	};
	$scope.$on('$ionicView.beforeEnter', refresh);
	$interval(refresh, 60000);
});
