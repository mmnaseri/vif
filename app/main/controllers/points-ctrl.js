'use strict';
angular.module('main').controller('PointsCtrl', function (Points, $scope) {

	var timestampToDate = function (timestamp) {
		var date = new Date(timestamp);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	};
	var refresh = function () {
		Points.all().groupBy('createDate', timestampToDate).then(function (result) {
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
			$scope.points = result;
		});
	};
	refresh();
	$scope.remove = function (point) {
		Points.all().where({
			$id: point.$id
		}).remove().then(refresh);
	};

});
