angular.module('paymentCtrlModule', ['serviceTransactionData', 'serviceHelpers'])
.controller('paymentCtrl', ['$rootScope', '$scope','$state', 'transactionService', 
  'passInfoService', 'confCodeService', 
  function($rootScope, $scope, $state, transactionService, passInfoService, confCodeService) {
  
    var transObj = passInfoService.retrieveInfo('trans');
    $scope.deal = passInfoService.retrieveInfo('deal');
    $scope.user = passInfoService.retrieveInfo('user');
    
    var updateTransObj = function (token){
      transObj.token = token.id;
      transObj.confCode = confCodeService.code;
      transObj.status = 'striped';
      transObj.transTimeStamp = Date.now();
    };

    var handler = StripeCheckout.configure({
      key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
      image: '/square-image.png',
      token: function(token, args) {
        updateTransObj(token);
        transactionService.update(transObj.transId, transObj, 'paid')
          .then (function(){
            $state.go('dealCompletion');
          });
      }
    });

    $scope.submitPay = function() {
      // Open Checkout with further options
      handler.open({
        name: 'Plentyy',
        description: transObj.dealTitle,
        amount: parseFloat(transObj.price) * 100
      });
    };

    $scope.cancelDeal = function(){
      transObj.status = 'canceled'; 
      transactionService.update(transObj.transId, transObj,'canceled');  
      $state.go('main.offersFeed');
    };

}]);
