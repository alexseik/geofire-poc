/**
 * Created on 22/04/15.
 */
(function () {
    "use strict";
    /* global GeoFire,Firebase*/
angular.module('starter.map',['firebase','angularGeoFire','starter.constants'])
    .controller('PositionCtrl',['$scope','$timeout','$log','Utilities','firebaseUrl', function($scope,$timeout,$log,Utilities,firebaseUrl){
        var refGeofire = new Firebase(firebaseUrl);
        var geoFire = new GeoFire(refGeofire);

        $scope.addedPositions = [];

        $scope.addPosition = function (position){
            if (angular.isNumber(position.longitude) && angular.isNumber(position.latitude)) {

                var numberPosition = [parseFloat(position.longitude),parseFloat(position.latitude)];
                var newPosition = {key:Utilities.generateRandomString(10) , location: numberPosition};
                geoFire.set(newPosition.key, newPosition.location).then(function() {
                    $timeout(function () {
                        $scope.addedPositions.push(newPosition);
                    });
                }, function(error) {
                    //console.log("Error: " + error);
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
    .controller('BrowseCtrl', function($scope, $timeout,GeofireServiceFactory) {
        $scope.searchResults = [];

        $scope.queryPosition = {
            center:[40.432948,-3.6511338],
            radius : 50
        };

        $scope.geofireService = new GeofireServiceFactory($scope.queryPosition,$scope);

        $scope.clickUpdateQuery = function (position){
            $scope.geofireService.updateCriteria(position);
        };

        $scope.clickDeletePosition = function(position){
            $scope.geofireService.removeRemotePosition(position);
        };

    })
    .controller('MapCtrl',function($scope){
        $scope.map = { center: { latitude: 40.432948, longitude: -3.651338 }, zoom: 8 };
    });
})();
