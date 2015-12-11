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

	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	
	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	$scope.errorM = false;

	// logs users in when the signin button is clicked
	$scope.signIn = function() {
		// authenticate user's emaill and password using firebase
		Auth.$authWithPassword({
			'email': $scope.emailAddress,
			'password': $scope.passcode
		})
		.then(function() {
			// if authentication is successful, go to 'posts' page
			$location.path('makePost');	
			location.reload();	
		})
		.catch(function(error) {
			// if authentication is unseccessful, displays an error message and stays in home page
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
	
	// get the current authenticated user's information
	var authData = Auth.$getAuth();

	console.log(authData);
	console.log($scope.userId);

	// if the user information is not null, display the user name and logout button on navigation bar
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

	// log user out when user clicks logout button, then go to home page and refreshes the page
	$scope.logOut = function() {
		Auth.$unauth();

		$location.path('home');
		location.reload();
	};
}])
.controller('SignupCtrl', ['$scope', '$http', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location) {
	
	var ref = new Firebase('https://pet-app.firebaseio.com');

	var usersRef = ref.child('users');
	console.log(usersRef);

	$scope.users = $firebaseObject(usersRef);

	var Auth = $firebaseAuth(ref);

	// creates a new user object
	$scope.newUser = {};

	$scope.correctM = false;
	$scope.errorM = false;

	// create new user when user click submit signup form button
	$scope.submit = function() {
		console.log("signing up: " + $scope.newUser.emailAddress);
		// create new user and enable email and password authentication
      	Auth.$createUser({
	        'email': $scope.newUser.emailAddress,
	        'password': $scope.newUser.password
      	})
      	.then(function() {
      		// log user in with this newly created account
			var promise = Auth.$authWithPassword({
				'email': $scope.newUser.emailAddress,
				'password': $scope.newUser.password
			});
			return promise;
      	})
      	.then(function(authData) {
      		// store user information such as phonenumber, occupation and gender etc into firebase
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
      		// if the user is successfully signed up, go to the user's profile and refreshes the page
  			$scope.correctM = true;
  			$location.path('profile');
  			location.reload();
      	})
      	.catch(function(error) {
      		// if sign up is not successful, stay in this page and display an error message
      		$scope.errorM = true;
      		console.log(error);
      	})
	};

	// disable the submit button if the user's password doesn't match confirmpassword
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

	// clear all the input boxes if user clicked reset button
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
			var petspecies = petRef.child('petspecies').on('value', function(snapshot) {
				$scope.petspecies = snapshot.val();
			})
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
			'petspecies': $scope.petspecies,
			'petbreed': $scope.petbreed,
			'petgender': $scope.petgender,
			'petage': $scope.petage,
			'petpicture': $scope.petpicture,
			'startdate': $scope.startdate.toString().substring(0, 15),
			'enddate':$scope.enddate.toString().substring(0,15),
			'totalpayment': $scope.salary,
			'reason': $scope.why,
			'contactinfo':$scope.contact,
			'posttime': Firebase.ServerValue.TIMESTAMP
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

    $scope.logSelect = function() {
    	console.log($scope.breedChoice);
    	if ($scope.breedChoice == 'All') {
    		$scope.breedChoice = '';
    	};
    };

    $scope.orderPayment = function() {
    	$scope.sortPayment = '-post.totalpayment';
    }
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

    //$scope.imgSrc = '#';

    /*$scope.readURL = function(input) {
    	if (input.files && input.files[0]) {
    		var reader = new FileReader();

    		reader.onload = function(i) {
    			$scope.imgSrc = i.target.result
    		};

    		reader.readAsDataURL(input.files[0]);
    	}
    }*/

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
    	console.log($scope.newPetName);
    	console.log(usersRef.child($scope.userId).child('pet'));
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
    	console.log($scope.petprofile.petspecies);
    	$scope.myprofile.pet = $scope.petprofile;
        $scope.myprofile.$save().then(function() {
            alert("Profile saved!");
            //$location.path('profile');
            //location.reload();
        }).catch(function(error) {
            alert("Error!");
        });
    };    

}]);
