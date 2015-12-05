'use strict';

angular.module('PetApp', ['ngSanitize', 'ui.router'])
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
	
}])