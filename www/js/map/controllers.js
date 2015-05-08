/**
 * Created on 22/04/15.
 */
'use strict';
angular.module('starter.map',['firebase','angularGeoFire'])
    .controller('PositionCtrl',['$scope', function($scope){
        var refGeofire = new Firebase('https://geofire-poc.firebaseio.com/web/geofire');
        var geoFire = new GeoFire(refGeofire);

        var generateRandomString = function (length) {
            var text = "";
            var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                text += validChars.charAt(Math.floor(Math.random() * validChars.length));
            }
            return text;
        };

        $scope.addPosition = function (position){
            if (typeof position.longitude !== 'undefined'
                && typeof position.latitude !== 'undefined'
                && position.longitude !== ''
                && position.latitude !== ''){

                var numberPosition = {'longitude':parseFloat(position.longitude),'latitude':parseFloat(position.latitude)};

                geoFire.set(generateRandomString(10), [numberPosition.longitude,numberPosition.latitude]).then(function() {
                    console.log("Provided key has been added to GeoFire");
                }, function(error) {
                    console.log("Error: " + error);
                });
            }
        };
    }])
    .controller('BrowseCtrl', function($scope, $geofire, $timeout,$log) {
        $scope.searchResults = [];

        var $geo = $geofire(new Firebase('https://geofire-poc.firebaseio.com/web/geofire'));

        $scope.geoQueryCallback = [];

        $scope.queryPosition = {
            longitude:  "40.432948",
            latitude: "-3.651338",
            radius :"30"
        };

        var query = $geo.$query({
            center: [parseFloat($scope.queryPosition.longitude), parseFloat($scope.queryPosition.latitude)],
            radius: parseFloat($scope.queryPosition.radius)
        });

        var geoQueryExitedCallback = query.on("key_exited", "SEARCH:KEY_EXITED");

        var geoQueryEnteredCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");

        var geoQueryReady = query.on("ready","SEARCH:READY");

        $scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {

            var exist = _.find($scope.searchResults,function(position){return position.key === key});
            if (exist === undefined) {
                $scope.$apply(function (scope) {

                    scope.searchResults.push({key: key, location: location, distance: distance});

                });
            }

        });

        $scope.$on("SEARCH:KEY_EXITED", function (event, key, location, distance) {

            $scope.$apply(function (scope) {

                scope.searchResults = _.reject(scope.searchResults,function(position){return position.key === key});

            });
        });

        $scope.$on("SEARCH:READY", function () {

            //geoQueryExitedCallback.cancel();
            //geoQueryEnteredCallback.cancel();
            //geoQueryReady.cancel();
        });

        $scope.clickUpdateQuery = function(){

            $timeout(function(){
                query.updateCriteria({
                    center: [parseFloat($scope.queryPosition.longitude), parseFloat($scope.queryPosition.latitude)],
                    radius: parseFloat($scope.queryPosition.radius)
                });
            }, 10);
        };


    });

