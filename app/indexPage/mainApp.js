var plentyyApp = angular.module('plentyyApp', ['ionic','indexCtrlModule', 'offersFeedCtrlModule', 
  'plentyyServices', 'ngResource', 'mapCtrlModule', 'accountCtrlModule', 
  'serviceLogin', 'waitForAuth', 'routeSecurity', 'appConfig', 'geoServiceModule', 'serviceDealData', 
  'paymentCtrlModule', 'dealDetailCtrlModule', 'userCtrlModule', 'servicePassInfo', 'serviceHelpers']);

plentyyApp.run(['loginService', '$rootScope', 'FBURL', 
      function(loginService, $rootScope, FBURL) {
      // establish authentication
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
   }]);

plentyyApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('/', {
      url: '/',
      templateUrl: 'app/indexPage/splash.html',
      controller: 'indexCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/account/login.html',
      controller: 'indexCtrl'
    })
    .state('signUp', {
      url: '/signUp',
      templateUrl: 'app/account/signup.html',
      controller: 'accountCtrl'
    })
    .state('inhouseLogin', {
      url: '/inhouseLogin',
      templateUrl: 'app/account/inhouseLogin.html',
      controller: 'accountCtrl'
    })        
    .state('main', {
      url: "/main",
      abstract: true,
      templateUrl: "app/indexPage/main.html",
      controller: 'indexCtrl'
    })
    .state('main.offersFeed', {
      url: "/offersFeed",
      views: {
        'menuContent' :{
          templateUrl: "app/offersFeed/offersFeed.html",
          controller: "offersFeedCtrl"
        }
      }
    })
    .state('main.account', {
      url: "/account",
      views: {
        'menuContent' :{
          templateUrl: "app/user/about.html",
          controller: "userCtrl"
        }
      }
    })
    .state('main.transactions', {
      url: "/transactions",
      views: {
        'menuContent' :{
          templateUrl: "app/user/transactions.html", 
          controller: "userCtrl"
        }
      }
    })
    .state('dealPage', {
      url: '/dealPage',
      templateUrl: 'app/dealDetail/dealPage.html',
      controller: 'dealDetailCtrl'
    })
    .state('directions', {
      url: '/directions',
      templateUrl: 'app/map/mapDirections.html',
      controller: 'dealDetailCtrl'
    })
    .state('dealConfirm', {
      url: '/dealConfirm',
      templateUrl: 'app/dealConfirm/dealConfirmation.html',
      controller: 'paymentCtrl'
    })
    .state('dealCompletion', {
      url: '/dealCompletion',
      templateUrl: 'app/dealCompletion/dealCompletion.html',
      controller: 'paymentCtrl'
    })
    .state('map', {
      url: '/map',
      templateUrl: 'app/map/mapPage.html',
      controller: 'mapCtrl'
    })
    .state('payment', {
      url: '/payment',
      templateUrl: 'app/payment/payment.html',
      controller: 'paymentCtrl'
    })               

    $urlRouterProvider.otherwise("/");

}])
