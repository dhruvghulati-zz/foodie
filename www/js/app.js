// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('foodapp', ['ionic', 'foodapp.controllers', 'foodapp.services', 'angular-md5','firebase', 'ngCordova'])
    .constant('FirebaseUrl', 'https://foodsharingapp.firebaseio.com/')
    .service('rootRef', ['FirebaseUrl', Firebase])

    .run(function ($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $rootScope.show = function(text) {
                $rootScope.loading = $ionicLoading.show({
                    content: text ? text : 'Loading..',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
            };

            $rootScope.hide = function() {
                $ionicLoading.hide();
            };

            $rootScope.notify = function(text) {
                $rootScope.show(text);
                $window.setTimeout(function() {
                    $rootScope.hide();
                }, 1999);
            };

            $rootScope.user;

        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('auth', {
                url: "/auth",
                abstract: true,
                templateUrl: "templates/auth.html"
            })

            .state('auth.login', {
                url: '/login',
                views: {
                    'auth-signin': {
                        controller: 'LoginCtrl as ctrl',
                        templateUrl: 'templates/login.html'
                    }
                },
                resolve: {
                    requireNoAuth: function($state, Auth){
                        return Auth.$requireAuth().then(function(auth){
                            $state.go('app.meals');
                        }, function(error){
                            return;
                        });
                    }
                }
            })

            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        controller: 'SignUpCtrl',
                        templateUrl: 'templates/signup.html'
                    }
                },
                resolve: {
                    requireNoAuth: function($state, Auth){
                        return Auth.$requireAuth().then(function(auth){
                            $state.go('app.meals');
                        }, function(error){
                            return;
                        });
                    }
                }
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.choice', {
                url: '/choice',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/choice.html'
                    }
                }
            })
            .state('app.meals', {
                url: '/meals',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/meals.html',
                        controller: 'MealsCtrl'
                    }
                }
            })

            .state('app.meal', {
                url: '/meals/:mealId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/meal.html',
                        controller: 'MealCtrl'
                    }
                }
            })

            .state('app.orders', {
                url: '/orders',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/orders.html',
                        controller: 'OrdersCtrl'
                    }
                }
            })
            .state('app.order', {
                url: '/orders/:orderId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/order.html',
                        controller: 'OrderCtrl'
                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                resolve: {
                    auth: function($state, Users, Auth){
                        return Auth.$requireAuth().catch(function(){
                            $state.go('auth.login');
                        });
                    },
                    profile: function(Users, Auth){
                        return Auth.$requireAuth().then(function(auth){
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl as profileCtrl'
                    }
                }
            })
            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MarkerRemoveCtrl'
                    }
                }
            })
            .state('app.addcourse', {
                url: '/addcourse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/addcourse.html',
                        controller: 'AddCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        //Change to login
        $urlRouterProvider.otherwise('app/meals');
    });
