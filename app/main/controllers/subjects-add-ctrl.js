'use strict';
angular.module('main')
	.controller('SubjectsAddCtrl', function (SubjectsService, $scope) {
		$scope.subjects = [];
		SubjectsService.load($scope.subjects);
	});
