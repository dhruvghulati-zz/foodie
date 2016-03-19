// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('foodapp', ['ionic', 'foodapp.controllers','foodapp.services','firebase','ngCordova'])
    .constant('FirebaseUrl', 'https://foodsharingapp.firebaseio.com/')
    .service('rootRef', ['FirebaseUrl', Firebase])

    .run(function ($ionicPlatform) {
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
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('login', {
                url: '/login',
                controller: 'LoginCtrl as ctrl',
                templateUrl: 'templates/login.html'
            })

            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'SignUpCtrl'
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
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapCtrl'
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
