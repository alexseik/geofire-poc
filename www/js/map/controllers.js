/**
 * Created on 22/04/15.
 */
'use strict';
angular.module('starter.map',["firebase"])
    .controller('BrowseCtrl',["$scope","$firebaseObject",function($scope,$firebaseObject){

        var ref = new Firebase('https://geofire-poc.firebaseio.com/web/data');
        var obj = $firebaseObject(ref);
        //todo: unregister unwatch
        var unwatch = obj.$watch(function(){
            this.name = obj.$value;
        },$scope);
        /*
         //reads only once
         obj.$loaded().then(function() {
         $scope.hola = obj.$value;
         });*/

        /* geofire !!!*/

        var log = function (message) {
            var childDiv = document.createElement("div");
            var textNode = document.createTextNode(message);
            childDiv.appendChild(textNode);
            document.getElementById("log").appendChild(childDiv);
        };

        var refGeofire = new Firebase('https://geofire-poc.firebaseio.com/web/geofire');
        var geoFire = new GeoFire(refGeofire);
        $scope.queryPosition = {
            longitude:  40.432948,
            latitude: -3.651338,
            radius :3000
        };
        var geoQuery = geoFire.query({
            center: [$scope.queryPosition.longitude, $scope.queryPosition.latitude],
            radius: $scope.queryPosition.radius
        });

        var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
            log("Found " + key + " with position: " + location[0] + "," + location[1]);
        });

        var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location) {
            log("Found " + key + " with position: " + location[0] + "," + location[1]);
        });

        /*
        var onKeyEnteredRegistration = geoQuery.on("ready", function() {

        });*/

        $scope.searchQuery = function(position){
            //todo cancel previous listener
            $scope.queryPosition.longitude = parseFloat(position.longitude);
            $scope.queryPosition.latitude = parseFloat(position.latitude);
            $scope.queryPosition.radius = parseFloat(position.radius);
            geoQuery.updateCriteria({
                center: [$scope.queryPosition.longitude, $scope.queryPosition.latitude ],
                radius: $scope.queryPosition.radius
            });
        }

        /*geoFire.set("some_key", [40.432948, -3.651338]).then(function() {
            console.log("Provided key has been added to GeoFire");
        }, function(error) {
            console.log("Error: " + error);
        });*/

        $scope.isLocationDefined = function (){
            return (typeof $scope.currentLocation !== "undefined");
        };

        $scope.showPosition = function (){
            geoFire.get("some_key").then(function(location) {
                if (location === null) {
                    console.log("Provided key is not in GeoFire");
                }
                else {
                    $scope.currentLocation = location;
                }
            }, function(error) {
                console.log("Error: " + error);
            });
        };

    }])
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
    }]);

