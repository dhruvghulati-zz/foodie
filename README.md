Food Sharing
=====================

An app for local families, cooks and mums to submit courses, and users to find food in their local area submitted by local people rather than at restaurants, Itsu etc.

Build in Ionic, using Firebase and Angularfire.

## To do

1. Refactor so that a factory can do all login, logout and other functions and obtain the user profile at all times including profile picture (potentially via Gravatar). Potentially use localStorage to store the key at all times.
2. Via `$ionicModal` from a `templateUrl` to view a specific `:id` of a Meal via the routes, and store in stateParams.
3. PayPal and third party payment
4. Post the data of where a chef cooks to `users` child in database via Google Places API.
4. Have database store home location of chef every time they submit a meal.
5. Have a course submitted appear in map via a marker (geolocation details via Google Geocoding API)
6. Test camera uploading controller for image of meal
7. Ordering system for users to add meals to their cart
8. Store buyer/seller and change `MenuCtrl` based on this.
9. Have map work in nested `ionic-view`.

## Issues

