'use strict';
angular.module('main')
	.controller('SubjectsCtrl', function ($log, $scope, SubjectsService) {
		$scope.subjects = [];
		SubjectsService.load($scope.subjects);
	});
