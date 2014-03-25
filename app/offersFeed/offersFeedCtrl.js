angular.module('offersFeedCtrlModule', ['ngResource', 'serviceDealData', 
  'serviceTransactionData', 'ionic','servicePassInfo', 'serviceHelpers'])

.controller('offersFeedCtrl', ['$rootScope', '$scope', '$state', 'dealDataService', '$firebaseSimpleLogin', '$firebase', 'loginService', 'userDataService','transactionService', '$ionicModal', 'geoGoogleService','passInfoService', 'dealsService', 
  function($rootScope, $scope, $state, dealDataService, $firebaseSimpleLogin, $firebase, loginService, userDataService, transactionService, $ionicModal, geoGoogleService, passInfoService, dealsService) {

    geoGoogleService.getUserPo()
    .then(function(data) {
      $scope.userLocation = [];
      $scope.userLocation.push(data.latitude);
      $scope.userLocation.push(data.longitude);
      $scope.radius = 200;  // in kilometers
      getDealsByLocation($scope, $rootScope); //Get deal around the user
    });

    var showActiveDeals = function (userId){
      var activeDealIds = [];
      transactionService.getByUserId(userId, 'active')
        .then(function(data){
          $scope.transDeals = dealsService.fetchDeals(data, $scope);
        }); 
    };

    var getDealsByLocation = function($scope, $rootScope){
      dealDataService.getActiveByUserLocation($scope.userLocation, $scope.radius)
      .then(function(data) {
        $scope.deals = dealsService.fetchDeals(data, $scope, true);
        if ($rootScope.auth.user) {
          var userId = $rootScope.auth.user.uid;
          showActiveDeals(userId); //get user's claimed deals + nearby deals
        } 
      });
    };

    $scope.onRefresh = function(){
      getDealsByLocation($scope, $rootScope);
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.logout = function() {
      loginService.logout();
      $scope.$on("$firebaseSimpleLogin:logout", function() {
        $state.go('login');
      });
    }; 

    $scope.goToDeal = function(path, deal) {
      passInfoService.storeInfo(deal, 'deal');
      $state.go(path);
    };

    $scope.goTo = function(path) {
      $state.go(path);
    }; 

    $scope.openNav = [
      {
        type: 'button-clear',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {
          $scope.sideMenuController.toggleLeft();
        }
      }
    ];
 
    $scope.openFilter = [
      {
        type: 'button-clear',
        content: '<i class="icon ion-ios7-search-strong"></i>',
        tap: function(e) {
          $scope.openModal();
        }
      }
    ];    

    // modal
    $ionicModal.fromTemplateUrl('modal.html', function(modal) {
      $scope.modal = modal;
      }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.cancelModal = function() {
      for (var i = 0; i < $scope.priceRange.length; i++) {
        $scope.priceRange[i].class = false;
      }
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });  

    $scope.priceRange = [{value:"$", class:false, cat:'price', min: 0, max: 10}, {value:"$$", class:false, cat:'price', min: 10, max: 20}, {value:"$$$", class:false, cat:'price', min: 20, max: 30}, {value:"$$$$", class:false, cat:'price', min: 30, max: undefined}];
    
    //function to toggle highlight class inside the modal
    $scope.toggleHighlight = function(item) {
      item.class = !item.class;
    };

    //create a filter for price from the modal with user's option
    $scope.priceFilter = function(deal) {
      var priceRng = $scope.priceRange;
      for (var i = 0; i < priceRng.length; i++) {
        if (priceRng[i].class === true){
          if (deal.dealPrice > priceRng[i].min  && !(deal.dealPrice > priceRng[i].max)){
            return true;
          } else {
            return false;
          }
        }
      }
      return true;
    }

}]);  

