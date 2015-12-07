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
			url: '/discussion', 
			templateUrl: 'partials/discussion.html',
			controller: 'DiscussionCtrl'
		})
		.state('makePost', {
		    url: '/makePost',
			templateUrl: 'partials/makePost.html',
			controller: 'makePostCtrl'	
		})
		.state('posts', {
		    url: '/posts',
			templateUrl: 'partials/posts.html',
			controller: 'postsCtrl'	
		})
})
.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
.controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
.controller('makePostCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
.controller('postsCtrl', ['$scope', '$http', function($scope, $http) {
	
}])