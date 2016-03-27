angular.module('foodapp.controllers', ['ngMap'])

    /**
     * This controls the items in the menu bar.
     */
    .controller('AppCtrl', function ($state, $scope, $ionicPopup, $location, Auth) {

        $scope.logout = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout',
                template: 'Are you sure you want to logout?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    //Auth.logout();
                    Auth.$unauth();
                    $state.go('auth.login');
                    console.log(Auth.$getAuth())
                } else {
                    console.log('You are not sure');
                    console.log(Auth.$getAuth())
                    $state.go($location.path('app/meals'));
                }
            });
        };

    })

    .controller('LocationCtrl', function ($scope) {
        $scope.location = {};
    })

    .controller('MealsCtrl', function (Auth, $scope, $rootScope, $window,$ionicModal, $timeout, $state, Meals, MealsFromDB) {
        console.log($window.localStorage['profile']);

        $scope.goMap = function () {
            $state.go("app.map");
        };

        $scope.goFav = function () {
            $state.go("app.fav");
        };

        $scope.goPop = function () {
            $state.go("app.pop");
        };

        $scope.meals = MealsFromDB.all();

        //No meals by category, this is all meals
        //$scope.meals = Meals.all();
        //
        //$ionicModal.fromTemplateUrl('templates/meal.html', {
        //    scope: $scope
        //}).then(function (modal) {
        //    $scope.modal = modal;
        //});
        //// Triggered in the product modal to close it
        //$scope.closeModal = function () {
        //    $scope.modal.hide();
        //};
        //
        //$scope.doOrder = function () {
        //    $state.go("app.orders");
        //    $timeout(function () {
        //        $scope.closeModal();
        //    }, 1000);
        //};
        //
        //// Click like product
        //$scope.doLike = function () {
        //    var btn_like = angular.element(document.querySelector('.product-like'));
        //    btn_like.find('i').toggleClass('active');
        //}
        //// Open the product modal
        //$scope.mealDetail = function ($id) {
        //    $scope.meal = Meals.get($id);
        //    $scope.modal.show();
        //};
        //
        //$scope.goBack = function () {
        //    window.history.back();
        //};
    })

    .controller('MealCtrl', function ($scope, $stateParams) {


    })

    .controller('LogoutCtrl', function (Auth, $scope, $ionicPopup, $state, $location, $ionicHistory) {


    })


    .controller('LoginCtrl', ['Auth', 'FirebaseUrl', 'Users', '$state', '$location', '$scope', '$rootScope', '$firebaseAuth', '$window',
        function (Auth, FirebaseUrl, Users, $state, $location, $scope, $rootScope, $firebaseAuth, $window) {

            $scope.user = {
                email: '',
                password: ''
            };

            $scope.validateUser = function (user) {

                $rootScope.show('Please wait.. Authenticating');
                console.log('Please wait.. Authenticating');

                var email = this.user.email;
                var password = this.user.password;

                /* Check user fields*/
                if (!email || !password) {
                    $rootScope.hide();
                    $rootScope.notify('Error', 'Email or Password is incorrect!');
                    return;
                }

                /* All good, let's authentify */
                Auth.$authWithPassword({
                    email: email,
                    password: password
                }).then(function (authData) {
                    console.log(authData);
                    //$rootScope.userEmail = user.email;
                    //Users.setUser(user.email);
                    $window.location.href = ('#/app/meals');
                    $rootScope.hide();
                }).catch(function (error) {
                    console.log("Login Failed!", error);
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.notify('Invalid Email Address');
                    }
                    else if (error.code == 'INVALID_PASSWORD') {
                        $rootScope.notify('Invalid Password');
                    }
                    else if (error.code == 'INVALID_USER') {
                        $rootScope.notify('Invalid User');
                    }
                    else {
                        $rootScope.notify('Oops something went wrong. Please try again later');
                    }
                    $rootScope.hide();
                    //$rootScope.notify('Error', 'Email or Password is incorrect!');
                });
            };

            $scope.loginWithGoogle = function () {
                Auth.$authWithOAuthPopup('google')
                    .then(function (authData) {
                        $state.go($location.path('app/meals'));
                    });
            };

            $scope.loginWithFacebook = function () {

                Auth.$authWithOAuthPopup('facebook')
                    .then(function (authData) {
                        console.log(authData);
                        console.log('user is created');
                        var usersRef = new Firebase('https://foodsharingapp.firebaseio.com/users');
                        var keyRef = usersRef.push({
                            'uid': authData.facebook.id,
                            'gender': authData.facebook.cachedUserProfile.gender,
                            'firstname': authData.facebook.cachedUserProfile.first_name,
                            'profile_pic': authData.facebook.profileImageURL,
                            'lastname': authData.facebook.cachedUserProfile.last_name
                        });
                        var uidRef = new Firebase('https://foodsharingapp.firebaseio.com/uids/' + authData.facebook.id + '/' + keyRef.key());
                        uidRef.set({'registered': true});
                        $state.go($location.path('app/meals'));
                    })
                    .catch(function (error) {
                        if (error.code === "TRANSPORT_UNAVAILABLE") {
                            Auth.$authWithOAuthRedirect("facebook").then(function (authData) {
                                // User successfully logged in. We can log to the console
                                // since we’re using a popup here
                                console.log(authData);
                                var usersRef = new Firebase('https://foodsharingapp.firebaseio.com/users');
                                var keyRef = usersRef.push({
                                    'uid': authData.facebook.id,
                                    'gender': authData.facebook.cachedUserProfile.gender,
                                    'firstname': authData.facebook.cachedUserProfile.first_name,
                                    'profile_pic': authData.facebook.profileImageURL,
                                    'lastname': authData.facebook.cachedUserProfile.last_name
                                });
                                var uidRef = new Firebase('https://foodsharingapp.firebaseio.com/uids/' + user.uid + '/' + keyRef.key());
                                uidRef.set({'registered': true});
                                $state.go($location.path('app/meals'));
                            });
                        } else {
                            // Another error occurred
                            console.log(error);
                        }

                    });

            };


            ////This sets the user as user.
            //Auth.$onAuth(function (AuthData) {
            //    if (AuthData === null) {
            //        console.log("Not logged in yet");
            //    } else {
            //        var uid = Auth.$getAuth().uid;
            //        console.log(uid);
            //        var uids = Users.allUIDs();
            //        for (var i = 0; i < uids.length; i++) {
            //            console.log(uids[i].id);
            //            if (uids[i].id == uid) {
            //                var userKeyRef = new Firebase(FirebaseUrl + "/uids/" + uids[i].id);
            //                userKeyRef.once('value').then(function (snapshot) {
            //                    key = snapshot.val();
            //                    console.log('key is' + key)
            //                }).then(function () {
            //                    var user = new Firebase(FirebaseUrl + "/users/").child(key).val();
            //                    console.log("Logged in as", AuthData.uid);
            //                    user.$loaded().then(function (profile) {
            //                        $window.localStorage['profile'] = profile;
            //                    })
            //                });
            //                console.log(user);
            //                console.log('User exists')
            //                break;
            //            }
            //        }
            //    }
            //    //$rootScope.user = user; // This will display the user's name in our view
            //});
        }
    ])

    .controller('SignUpCtrl', [
        '$scope', '$firebaseObject', 'FirebaseUrl', '$rootScope', '$firebaseAuth', '$window', 'Auth',
        function ($scope, $firebaseObject, FirebaseUrl, $rootScope, $firebaseAuth, $window, Auth) {

            $scope.user = {
                firstname: '',
                lastname: '',
                email: "",
                password: ""
            };
            $scope.createUser = function () {
                var firstname = this.user.firstname;
                var lastname = this.user.lastname;
                var email = this.user.email;
                var password = this.user.password;

                if (!email || !password) {
                    $rootScope.notify("Please enter valid credentials");
                    return false;
                }

                $rootScope.show('Please wait.. Registering');
                Auth.$createUser(
                    {email: email, password: password})
                    .then(function (authData) {
                        console.log('user is created');
                        $rootScope.hide();
                        var userRef = new Firebase(FirebaseUrl).child('users').child(authData.uid);
                        userRef.set({
                            'uid': authData.uid,
                            'email': email,
                            'firstname': firstname,
                            'lastname': lastname
                        });
                        $window.location.href = ('#/app/meals');
                    }, function (error) {
                        console.log('error unfortunately');
                        $rootScope.hide();
                        if (error.code == 'INVALID_EMAIL') {
                            console.log('invalid email');
                            $rootScope.notify('Invalid Email Address');
                        }
                        else if (error.code == 'EMAIL_TAKEN') {
                            console.log('email taken');
                            $rootScope.notify('Email Address already taken');
                        }
                        else {
                            console.log('not sure what happened');
                            $rootScope.notify('Oops something went wrong. Please try again later');
                        }
                    });

            }

            //This sets the user as user.
            //Auth.$onAuth(function (authData) {
            //    if (authData == null) {
            //        console.log("Not logged in yet");
            //    } else {
            //        var currentUser = '';
            //        angular.copy(authData, currentUser);
            //        currentUser = $firebaseObject((FirebaseUrl).child('users').child(authData.uid));
            //        currentUser.$loaded().then(function (profile) {
            //            $window.localStorage['profile'] = profile;
            //            console.log("Logged in as", $window.localStorage['profile'].firstname);
            //        })
            //    }
            //});
        }
    ])

    .controller('ProfileCtrl', [
        '$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$window', 'md5','Auth', 'UIDs', 'Users', '$stateParams',
        function ($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $window,md5, Auth, UIDs, Users, $stateParams) {

            var profileCtrl = this;
            profileCtrl.profile = profile;

            profileCtrl.updateProfile = function(){
                profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
                profileCtrl.profile.$save();
            };

            $scope.user = Auth.user;

        }
    ])


    .controller('OrderCtrl', function ($scope, $stateParams) {
    })
    .controller('OrdersCtrl', function ($scope, $stateParams) {
    })

    .controller('MarkerRemoveCtrl', function ($scope, $ionicLoading) {

        $scope.positions = [{
            lat: 43.07493,
            lng: -89.381388
        }];

        $scope.$on('mapInitialized', function (event, map) {
            $scope.map = map;
        });

        $scope.centerOnMe = function () {
            $scope.positions = [];


            $ionicLoading.show({
                template: 'Loading...'
            });


            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $scope.positions.push({lat: pos.k, lng: pos.B});
                console.log(pos);
                $scope.map.setCenter(pos);
                $ionicLoading.hide();
            });

        };

    })

    .controller('MapCtrl', function ($scope, $ionicLoading, $compile) {

        $scope.init = function () {
            var myLatlng = new google.maps.LatLng(43.07493, -89.381388);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

            $scope.map = map;
        };

        // google.maps.event.addDomListener(window, 'load', initialize);

        $scope.centerOnMe = function () {
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $ionicLoading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    })

    .controller('AddCtrl', function (Users, $scope, $firebase, $stateParams, $ionicModal, $firebaseArray, $rootScope, $cordovaCamera) {

        $scope.upload = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                syncArray.$add({image: imageData}).then(function () {
                    alert("Image has been uploaded");
                });
            }, function (error) {
                console.error(error);
            });
        }

        //var ref = new Firebase('https://foodsharingapp.firebaseio.com/courses/');
        //$scope.courses = $firebaseArray(ref);

        var firebaseObj = new Firebase("https://foodsharingapp.firebaseio.com/courses/");
        var fb = $firebaseArray(firebaseObj);

        console.log($rootScope.user)

        $scope.newMeal = {
            name: "",
            price: "",
            ingredients: "",
            description: "",
            category: "",
            cuisine: "",
            userID: ""
        };

        $scope.categories = [
            {id: 1, name: 'Breakfast'},
            {id: 2, name: 'Lunch'},
            {id: 3, name: 'Dinner'}
        ];

        $scope.cuisines = [
            {id: 1, name: 'Thai'},
            {id: 2, name: 'Chinese'},
            {id: 3, name: 'Italian'},
            {id: 4, name: 'British'},
            {id: 5, name: 'Spanish'},
            {id: 6, name: 'Indian'},
            {id: 7, name: 'French'},
            {id: 8, name: 'Vietnamese'},
            {id: 9, name: 'Nordic'}
        ];

        $scope.submitMeal = function () {
            if (angular.equals({}, $scope.newMeal)) {
                alert("Your form is empty");
                $rootScope.notify('Your form is empty')
            } else {
                console.log($scope.newMeal);
                var name = $scope.newMeal.name;
                var price = $scope.newMeal.price;
                var ingredients = $scope.newMeal.ingredients;
                var description = $scope.newMeal.description;
                var category = $scope.newMeal.category;
                var cuisine = $scope.newMeal.cuisine;

                fb.$add({
                    name: name,
                    price: price,
                    ingredients: ingredients,
                    description: description,
                    category: category,
                    cuisine: cuisine,
                    userID: $rootScope.user.uid
                }).then(function (ref) {
                    $scope.newMeal = {};
                    console.log(ref);
                }, function (error) {
                    console.log("Error:", error);
                });

                //$scope.courses.$add
                //    (
                //        $scope.newMeal
                //    )
                //    .then(function (res) {
                //        $scope.newMeal = {};
                //    });

                $rootScope.notify('New meal has been added!')
            }

        };
    });


