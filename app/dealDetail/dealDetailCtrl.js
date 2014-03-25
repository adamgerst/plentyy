angular.module('dealDetailCtrlModule', ['ngResource', 'plentyyServices', 'serviceDealData', 
  'serviceTransactionData', 'ionic', 'serviceMerchantData'])
.controller('dealDetailCtrl', ['$rootScope', '$scope', 'plentyyServices', '$state', 
  'dealDataService', '$firebaseSimpleLogin', '$firebase', 'loginService', 'userDataService',
  'transactionService', '$ionicModal', 'passInfoService', 'merchantDataService',
  function($rootScope, $scope, plentyyServices, $state, dealDataService, $firebaseSimpleLogin, 
    $firebase, loginService, userDataService, transactionService, $ionicModal, passInfoService,
    merchantDataService) {

    $scope.deal = passInfoService.retrieveInfo('deal');
  
    var makeTransactionObj = function(){
      var transObj = {};
      angular.extend(transObj, $scope.deal);
      transObj.userId        = $rootScope.auth.user.uid;
      transObj.quantity      = 1; 
      transObj.userBehavior  = [{clicked : true}];
      transObj.status        = 'claimed';
      passInfoService.storeInfo(transObj, 'trans');
      return transObj;
    };

    dealDataService.getQuantityById($scope.deal.dealId)
     .$on('loaded', function(val){
        if(val){
          $scope.deal.quantity = val;
        }
      });

     merchantDataService.getById($scope.deal.merchantId)
      .then(function(merchObj){
        $scope.merch = merchObj[$scope.deal.merchantId];
      });

    $scope.claim = function(dealObj){
      if(!$rootScope.auth.user) {
        $scope.openModal();
      }else {
        passInfoService.storeInfo($scope.deal, 'deal')
        transactionService.create(makeTransactionObj());  
        $scope.goTo('dealConfirm');
      }
    };

    $scope.goTo = function(path) {
      $state.go(path);
    }; 

    // modal to open login when auth fails
    $ionicModal.fromTemplateUrl('auth.html', function(modal) {
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

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.fblogin = function() {
      loginService.fblogin();
      $scope.$on("$firebaseSimpleLogin:login", function() {
        passInfoService.storeInfo($scope.deal, 'deal');
        transactionService.create(makeTransactionObj());  
        $state.go('dealConfirm');
        $scope.modal.hide();
      });
    };  

    $scope.createBackBtn = function(state){
      return [
        {
          type: 'button-clear',
          content: '<i class="icon ion-arrow-left-b"></i>',
          tap: function(e) {
            $state.go(state);
          }
        }
      ];
    }

    $scope.backTo = $scope.createBackBtn('main.offersFeed');

    $scope.backToDeal = $scope.createBackBtn('dealPage');

  }]);
