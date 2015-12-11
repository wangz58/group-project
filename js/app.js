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
.controller('HomeCtrl', ['$scope', '$http', '$firebaseObject', '$firebaseAuth', '$location', function($scope, $http, $firebaseObject, $firebaseAuth, $location) {

	$scope.bgimg = "http://www.urdogs.com/wp-content/uploads/2015/08/dog-love-cute-wallpaper-1366x768.jpg";
	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	
	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	$scope.errorM = false;

	$scope.signIn = function() {
		Auth.$authWithPassword({
			'email': $scope.emailAddress,
			'password': $scope.passcode
		})
		.then(function() {
			$location.path('posts');	
			location.reload();	
		})
		.catch(function(error) {
			$scope.errorM = true;
			console.log(error)
		});
	};
}])
.controller('NavbarCtrl', ['$scope', '$http', '$firebaseObject', '$firebaseAuth', '$location',function($scope, $http, $firebaseObject, $firebaseAuth, $location) {
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

		$location.path('posts');
		location.reload();
	};
}])
.controller('SignupCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location) {
	
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

      		console.log($scope.newUser.sex);

      		var newUserInfo = {
      			'picture': 'css/img/user-no-img.png',
      			'gender': $scope.newUser.sex,
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
  			$location.path('profile');
  			location.reload();
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

.controller('makePostCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location) {

	var ref = new Firebase('https://pet-app.firebaseio.com');

	var postsRef = ref.child('posts');
	var usersRef = ref.child('users');

	$scope.posts = $firebaseArray(postsRef);
	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	var authData = Auth.$getAuth();


	if (authData) {
		$scope.userId = authData.uid;
		var singleUser = usersRef.child($scope.userId);
		var ownerName = singleUser.child('customername').on('value', function(snapshot) {
			$scope.ownername = snapshot.val();
		});
		var petRef = singleUser.child('pet');
		if (petRef) {
			var Name = petRef.child('petname').on('value', function(snapshot) {
				$scope.petname = snapshot.val();
			});
			var gender = petRef.child('petgender').on('value', function(snapshot) {
				$scope.petgender = snapshot.val();
			});
			var breed = petRef.child('petbreed').on('value', function(snapshot) {
				$scope.petbreed = snapshot.val();
			});
			var picture = petRef.child('petpicture').on('value', function(snapshot) {
				$scope.petpicture = snapshot.val();
			});
			var age = petRef.child('petage').on('value', function(snapshot) {
				$scope.petage = snapshot.val();
			}); 
 			$scope.hasPet = true;
		} else {
			$scope.hasPet = false;
		}
	};

	$scope.seeStart = function() {
		console.log($scope.startdate.toString());
	};

	$scope.seeEnd = function() {
		console.log($scope.enddate.toString());
	};

	$scope.errorM = false;

	$scope.postIt = function() {
		console.log($scope.daterange);
		$scope.posts.$add({
			'petowner': $scope.userId,
			'ownername': $scope.ownername,
			'petname': $scope.petname,
			'petbreed': $scope.petbreed,
			'petgender': $scope.petgender,
			'petage': $scope.petage,
			'petpicture': $scope.petpicture,
			'startdate': $scope.startdate.toString().substring(0, 15),
			'enddate':$scope.enddate.toString().substring(0,15),
			'totalpayment': $scope.salary,
			'reason': $scope.why,
			'contactinfo':$scope.contact,
		})
		.then(function() {
			$scope.errorM = false;
			$location.path('posts');
			location.reload();
		})
		.catch(function(error) {
			$scope.errorM = true;
			console.log(error);
		});
	};
}])
.controller('postsCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {
    var ref = new Firebase('https://pet-app.firebaseio.com');

    var usersRef = ref.child('users');
    var postsRef = ref.child('posts');

	$scope.posts = $firebaseArray(postsRef);
	$scope.users = $firebaseObject(usersRef);    

    var Auth = $firebaseAuth(ref);

    var authData = Auth.$getAuth();	
}])
.controller('ProfileCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth) {

    var ref = new Firebase('https://pet-app.firebaseio.com');

    var usersRef = ref.child('users');
    var postsRef = ref.child('posts');

    var Auth = $firebaseAuth(ref);

    var authData = Auth.$getAuth();

    if (authData) {
        $scope.userId = authData.uid;
        if ($scope.userId) {
            $scope.myprofile = $firebaseObject(usersRef.child($scope.userId));
            if (usersRef.child($scope.userId).child('pet')) {
            	$scope.petprofile = $firebaseObject(usersRef.child($scope.userId).child('pet'));
            }
        }
    }

}])

.controller('EditCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', '$timeout', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location, $timeout) {
    var ref = new Firebase('https://pet-app.firebaseio.com');

    var usersRef = ref.child('users');
    var postsRef = ref.child('posts');

    var Auth = $firebaseAuth(ref);

    var authData = Auth.$getAuth();

    if (authData) {
        $scope.userId = authData.uid;
        if ($scope.userId) {
            $scope.myprofile = $firebaseObject(usersRef.child($scope.userId));
            if (usersRef.child($scope.userId).child('pet')) {
            	$scope.petprofile = $firebaseObject(usersRef.child($scope.userId).child('pet'));
        	} else {
        		$scope.petprofile = {};
        	}
        	console.log($scope.petprofile);
    	};
	};

	$scope.newPetName = false;

	$scope.hasPet = function() {
		$scope.newPetName = true;
	};
    // update the myprofile
    $scope.updateMyProfile = function() {
    	console.log($scope.myprofile.picture);
    	console.log($scope.petprofile.petpicture);
    	console.log($scope.userId);
    	var pet = usersRef.child($scope.userId).child('pet').on('value', function(snapshot) {
    		var hasPet = snapshot.val();
    		console.log(hasPet);
       	});
       	console.log($scope.petprofile.petname);

    	if ($scope.newPetName && usersRef.child($scope.userId).child('pet')) {
    		console.log(usersRef.child($scope.userId).child('pet'));
    		
			if (!$scope.petprofile.petpicture) {
    			$scope.petprofile.petpicture = 'css/img/pet-no-img.jpg';
        	};

			var newUserInfo = {
          	'image': $scope.newUser.avatar,
          	}
            $scope.users[authData.uid] = newUserInfo;
            $scope.users.$save();
            $scope.userId = authData.uid; //the id of the current user

            if (!$scope.petprofile.petbreed) {
    			$scope.petprofile.petbreed = '';
    		};
    		if (!$scope.petprofile.petgender) {
    			$scope.petprofile.petgender = '';
    		};
    		if (!$scope.petprofile.petspecies) {
    			$scope.petprofile.petspecies = '';
    		};
    		if (!$scope.petprofile.petage) {
    			$scope.petprofile.petage = '';
    		};		    
    		if (!$scope.petprofile.petdescription) {
    			$scope.petprofile.petdescription = '';
    		};
    		var petInfo = {
    			'petname': $scope.petprofile.petname,
    			'petspecies': $scope.petprofile.petspecies,
    			'petbreed': $scope.petprofile.petbreed,
    			'petgender': $scope.petprofile.petgender,
    			'petpicture': $scope.petprofile.petpicture,
    			'petage': $scope.petprofile.petage,
    			'petdescription': $scope.petprofile.petdescription
    		};
    		console.log(petInfo);	    				
    		$scope.petprofile = petInfo;
    		console.log($scope.petprofile);
    	};

    	$scope.myprofile.pet = $scope.petprofile;
        $scope.myprofile.$save().then(function() {
            alert("Profile saved!");
            //$location.path('profile');
            //location.reload();
        }).catch(function(error) {
            alert("Error!");
        });  
    }; 
}])


