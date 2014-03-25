angular.module('offersFeedCtrlModule')
  .controller('singleDealCtrl', ['$rootScope', '$scope', 'plentyyServices', '$state', 
    'dealDataService', '$firebase',  'userDataService', '$ionicModal','passInfoService',
    function($rootScope, $scope, plentyyServices, $state, dealDataService,  
      $firebase, userDataService, $ionicModal, 
      passInfoService) {
      dealDataService.getQuantityById($scope.deal.dealId)
       .$on('loaded', function(val){
          if(val){
            $scope.deal.quantity = val;
          }
        });
}]);
