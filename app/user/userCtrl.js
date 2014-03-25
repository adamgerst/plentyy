angular.module('userCtrlModule', ['ngResource', 'plentyyServices', 'serviceTransactionData'])

.controller('userCtrl', ['$rootScope', '$scope', 'plentyyServices', '$state', 'loginService', 'transactionService', function($rootScope, $scope, plentyyServices, $state, loginService, transactionService) {

  $scope.getTransactions = function() {
    $scope.user = $rootScope.auth.user.uid;
    transactionService.getByUserId($scope.user)
      .then(function(data) {
      $scope.transactions = data;    
    });
  };

  $scope.goTo = function(path) {
    $state.go(path);
  }

  $scope.openNav = [
    {
      type: 'button-clear',
      content: '<i class="icon ion-navicon"></i>',
      tap: function(e) {
        $scope.sideMenuController.toggleLeft();
      }
    }
  ];

}])
