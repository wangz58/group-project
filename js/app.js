'use strict';

angular.module('PetApp', ['ngSanitize', 'ui.router', 'firebase'])
.config(function($stateProvider){
	$stateProvider
		.state('index', {

		})
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
		.state('profile', {
			url: '/profile', 
			templateUrl: 'partials/profile.html',
			controller: 'ProfileCtrl'
		})
		.state('edit', {
			url: '/edit', 
			templateUrl: 'partials/edit.html',
			controller: 'EditCtrl'
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
.controller('NavbarCtrl', ['$scope', '$http', '$firebaseObject', '$firebaseAuth', '$location', function($scope, $http, $firebaseObject, $firebaseAuth, $location) {
	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	
	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);
	
	var authData = Auth.$getAuth();

	console.log(authData);
	console.log($scope.userId);

	if (authData) {
		$scope.userId = authData.uid;
		console.log($scope.userId);
		if ($scope.userId) {
			var singleRef = usersRef.child($scope.userId);
			var findUsername = singleRef.child('customername').on('value', function(snapshot) {
				$scope.username = snapshot.val();
			});
		};
	};


	$scope.logOut = function() {
		Auth.$unauth();
		location.reload();
	};
}])
.controller('SignupCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {
	
	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	console.log(usersRef);

	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	$scope.newUser = {};

	$scope.correctM = false;
	$scope.errorM = false;

	$scope.submit = function() {
		console.log("signing up: " + $scope.newUser.emailAddress);
      	Auth.$createUser({
	        'email': $scope.newUser.emailAddress,
	        'password': $scope.newUser.password
      	})
      	.then(function() {
			var promise = Auth.$authWithPassword({
				'email': $scope.newUser.emailAddress,
				'password': $scope.newUser.password
			});
			return promise;
      	})
      	.then(function(authData) {
      		if (!$scope.newUser.phoneNumber) {
      			$scope.newUser.phoneNumber = '';
      		};

      		if (!$scope.newUser.career) {
      			$scope.newUser.career = '';
      		}

      		var newUserInfo = {
      			'customername': $scope.newUser.customerName,
      			'phonenumber': $scope.newUser.phoneNumber,
      			'career': $scope.newUser.career,
      			'streetaddress': $scope.newUser.streetAddress,
      			'city': $scope.newUser.city,
      			'state': $scope.newUser.state,
      			'postalcode': $scope.newUser.postalCode
      		};

      		$scope.users[authData.uid] = newUserInfo;

      		$scope.users.$save();
      	})
      	.then(function() {
  			$scope.correctM = true;
      	})
      	.catch(function(error) {
      		$scope.errorM = true;
      		console.log(error);
      	})
	};

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
.controller('makePostCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
.controller('postsCtrl', ['$scope', '$http', function($scope, $http) {

}])
.controller('ProfileCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {
	
	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	console.log(usersRef);

	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	var authData = Auth.$getAuth();

	if (authData) {
		$scope.userId = authData.uid;
		if ($scope.userId) {
			var singleUser = usersRef.child($scope.userId);
			var Name = singleUser.child('customername').on('value', function(snapshot) {
				$scope.Name = snapshot.val();
			});
			var gender = singleUser.child('customergender').on('value', function(snapshot) {
				$scope.gender = snapshot.val();
			});
			var phonenum = singleUser.child('customerphonenum').on('value', function(snapshot) {
				$scope.phonenum = snapshot.val();
			});
			var street = singleUser.child('customerstreet').on('value', function(snapshot) {
				$scope.street = snapshot.val();
			});
			var city = singleUser.child('customercity').on('value', function(snapshot) {
				$scope.city = snapshot.val();
			});
			var state = singleUser.child('customerstate').on('value', function(snapshot) {
				$scope.state = snapshot.val();
			});
			var postcode = singleUser.child('customerpostcode').on('value', function(snapshot) {
				$scope.postcode = snapshot.val();
			});
			var email = singleUser.child('customeremail').on('value', function(snapshot) {
				$scope.email = snapshot.val();
			});
		}
	}


	ref.on("value", function(snapshot) {
    console.log(snapshot.val());
    }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    });
	
}])
.controller('EditCtrl', ['$scope', '$http', function($scope, $http) {
	
}])
