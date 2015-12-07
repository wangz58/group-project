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
.controller('SignupCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth',function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {
	
	var ref = new Firebase('https://pet-app.firebaseio.com/');

	var userRef = ref.child('users');

	$scope.users = $firebaseObject('userRef');

	var Auth = $firebaseAuth(ref);
	$scope.newUser = {};

	$scope.signup = function() {
		console.log('signing up ');
	}

	$scope.compareTo = function() {
		console.log($scope.newUser.password);
		console.log($scope.newUser.confirmPassword);
		//check whether the password and confirm password are empty and whether they are the same.
		if ($scope.newUser.password != null && $scope.newUser.confirmPassword != null && $scope.newUser.password === $scope.newUser.confirmPassword) {
			return true;
		} else {
			return false;
		}
	};
	$scope.reset = function() {
		location.reload();
	};
}])