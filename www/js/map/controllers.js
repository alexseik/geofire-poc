/**
 * Created on 22/04/15.
 */
'use strict';
angular.module('starter.map',['firebase','angularGeoFire'])
    .controller('PositionCtrl',['$scope','$timeout','Utilities', function($scope,$timeout,Utilities){
        var refGeofire = new Firebase('https://geofire-poc.firebaseio.com/web/geofire');
        var geoFire = new GeoFire(refGeofire);

        $scope.addedPositions = [];

        $scope.addPosition = function (position){
            if (typeof position.longitude !== 'undefined'
                && typeof position.latitude !== 'undefined'
                && position.longitude !== ''
                && position.latitude !== ''){

                var numberPosition = {'longitude':parseFloat(position.longitude),'latitude':parseFloat(position.latitude)};
                var position = {key:Utilities.generateRandomString(10) , location: [numberPosition.longitude,numberPosition.latitude]};
                geoFire.set(position.key, position.location).then(function() {
                    $timeout(function () {
                        $scope.addedPositions.push(numberPosition);
                    });
                }, function(error) {
                    console.log("Error: " + error);
                });
            }
        };

        $scope.removeRemotePosition = function(position){
            geoFire.$remove(position.key)
                .catch(function (err) {
                    $log.error(err);
                });
        };
    }])
    .controller('BrowseCtrl', function($scope, $timeout,geofireServiceFactory) {
        $scope.searchResults = [];

        $scope.queryPosition = {
            center:[40.432948,-3.6511338],
            radius : 50
        };

        $scope.geofireService = new geofireServiceFactory($scope.queryPosition,$scope);

        $scope.clickUpdateQuery = function (position){
            $scope.geofireService.updateCriteria(position);
        }

        $scope.clickDeletePosition = function(position){
            $scope.geofireService.removeRemotePosition(position);
        }

    })
    .controller('MapCtrl',function($scope){
        $scope.map = { center: { latitude: 40.432948, longitude: -3.651338 }, zoom: 8 };
    });

