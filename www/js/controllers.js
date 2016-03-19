angular.module('foodapp.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        //Is AppCtrl available for all?

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.goBack = function () {
            window.history.back();
        };

    })

    .controller('MealsCtrl', function ($scope, $ionicModal, $timeout, $state, Meals) {

        $scope.goMap = function(){
            $state.go("app.map");
        };

        $scope.goFav = function(){
            $state.go("app.fav");
        };

        $scope.goPop = function(){
            $state.go("app.pop");
        };

        //No meals by category, this is all meals
        $scope.meals = Meals.all();

        $ionicModal.fromTemplateUrl('templates/meal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // Triggered in the product modal to close it
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.doOrder = function () {
            $state.go("app.orders");
            $timeout(function () {
                $scope.closeModal();
            }, 1000);
        };

        // Click like product
        $scope.doLike = function(){
            var btn_like = angular.element(document.querySelector('.product-like'));
            btn_like.find('i').toggleClass('active');
        }
        // Open the product modal
        $scope.mealDetail = function ($id) {
            $scope.meal = Meals.get($id);
            $scope.modal.show();
        };

        $scope.goBack = function () {
            window.history.back();
        };

        //$scope.meals = [
        //    //Needs to be changed to have schema
        //    {title: 'Meal 1', id: 1},
        //    {title: 'Meal 2', id: 2},
        //    {title: 'Meal 3', id: 3},
        //    {title: 'Meal 4', id: 4},
        //    {title: 'Meal 5', id: 5},
        //    {title: 'Meal 6', id: 6}
        //];
    })

    .controller('MealCtrl', function ($scope, $stateParams) {
    })

    .controller('LoginCtrl', ['Auth','$state','$location',function (Auth, $state, $location) {

        this.loginWithGoogle = function loginWithGoogle() {
            Auth.$authWithOAuthPopup('google')
                .then(function(authData) {
                    $state.go($location.path('app/meals'));
                });
        };

    }])

    .controller('SignUpCtrl', function ($scope, $stateParams) {
    })

    .controller('ProfileCtrl', function ($scope, $stateParams) {
    })
    .controller('OrderCtrl', function ($scope, $stateParams) {
    })
    .controller('OrdersCtrl', function ($scope, $stateParams) {
    })

    .controller('MapCtrl', function ($scope, $ionicLoading, $compile) {
        function initialize() {
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
        }

        google.maps.event.addDomListener(window, 'load', initialize);

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


    .controller('AddCtrl', function ($scope, $stateParams, $ionicModal, $firebaseArray, $cordovaCamera) {



        //var orderArray = $firebaseArray(userReference.child("orders"));

        $scope.upload = function() {
            var options = {
                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                syncArray.$add({image: imageData}).then(function() {
                    alert("Image has been uploaded");
                });
            }, function(error) {
                console.error(error);
            });
        }

        // array list which will contain the items added
        $scope.toDoListItems = [];

        //init the modal
        $ionicModal.fromTemplateUrl('modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

// function to open the modal
        $scope.openModal = function () {
            $scope.modal.show();
        };

// function to close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

//Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

//function to add items to the existing list
        $scope.AddItem = function (data) {
            $scope.toDoListItems.push({
                task: data.newItem,
                status: 'not done'
            });
            data.newItem = '';
            $scope.closeModal();
        };
    });


