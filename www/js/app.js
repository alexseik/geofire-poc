angular.module('starter', ['ionic', 'starter.controllers', 'starter.map'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.positions', {
    url: "/positions",
    views: {
      'menuContent': {
        templateUrl: "templates/positions.html",
          controller: 'PositionCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    //controller: 'MapCtrl',
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: 'BrowseCtrl'
      }
    }
  })
  .state('app.search', {
    url: "/search",
    //controller: 'MapCtrl',
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'SomeCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});
