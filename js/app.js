'use strict';

angular.module('PetApp', ['ngSanitize', 'ui.router', 'firebase'])
.config(function($stateProvider){
	$stateProvider
		.state('home', {
			url: '/', //"root" directory
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'partials/signup.html',
			controller: 'SignupCtrl'
		})	
		.state('discussion', {
			url: '/discussion', // bean id for each type of bean in order page
			templateUrl: 'partials/discussion.html',
			controller: 'DiscussionCtrl'
		})
})
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
.controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.compareTo = function() {
		console.log($scope.password);
		console.log($scope.confirmPassword);
		//check whether the password and confirm password are empty and whether they are the same.
		if ($scope.password != null && $scope.confirmPassword != null && $scope.password === $scope.confirmPassword) {
			return true;
		} else {
			return false;
		}
	};
	$scope.reset = function() {
		location.reload();
	};
	$scope.submit = function() {



	}
}])