/**
 * Created on 22/04/15.
 */
'use strict';
angular.module('starter.map',["firebase"])

.controller('MapCtrl',["$scope","$firebaseObject",function($scope,$firebaseObject){

        var ref = new Firebase('https://geofire-poc.firebaseio.com/web/data');
        var obj = $firebaseObject(ref);

        /*
        //reads only once
        obj.$loaded().then(function() {
            $scope.hola = obj.$value;
        });*/
        //todo: unregister unwatchs
        var unwatch = obj.$watch(function(){
            this.hola = obj.$value;
        },$scope);

    }]);

