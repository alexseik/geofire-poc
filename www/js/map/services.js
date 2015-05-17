/**
 * Created by alexseik on 11/05/15.
 */


(function () {
    'use strict';
    /* global Firebase,_*/
    var Utilities = function(){};

    Utilities.prototype = {
        generateRandomString : function (length) {
            var text = "";
            var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                text += validChars.charAt(Math.floor(Math.random() * validChars.length));
            }
            return text;
        }
    };

    angular.module('starter.map').service('Utilities', Utilities);

    angular.module('starter.map').factory('GeofireServiceFactory',['$timeout','$geofire','$log','firebaseUrl',function($timeout,$geofire,$log,firebaseUrl){
        var $geo = $geofire(new Firebase(firebaseUrl));
        return function(queryPosition,scope){
            var thatScope = scope;
            this.geo = $geo;
            this.query  = $geo.$query(queryPosition);
            this.attachedCallbacks = [];
            this.attachedCallbacks.push(this.query.on("key_exited", "SEARCH:KEY_EXITED"));
            this.attachedCallbacks.push(this.query.on("key_entered", "SEARCH:KEY_ENTERED"));
            //this.attachedCallbacks.push(this.query.on("ready", "SEARCH:READY"));

            scope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
                var exist = _.find(thatScope.searchResults,function(position){return position.key === key;});
                if (exist === undefined) {
                    $timeout(function () {
                        thatScope.$apply(function () {
                            thatScope.searchResults.push({key: key, location: location, distance: distance});
                        });
                    });
                }
            });

            scope.$on("SEARCH:KEY_EXITED", function (event, key, location, distance) {
                $timeout(function () {
                    thatScope.$apply(function () {
                        thatScope.searchResults = _.reject(thatScope.searchResults,function(position){return position.key === key;});
                    });
                });
            });

            this.updateCriteria = function(newQueryPosition){
                this.query.updateCriteria(newQueryPosition);
            };

            this.removeRemotePosition = function(position){
                this.geo.$remove(position.key)
                    .catch(function (err) {
                       $log.error(err);
                    });
            };

        };
    }]);
})();