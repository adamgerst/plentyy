angular.module('accountCtrlModule', ['ngResource', 'plentyyServices'])

.controller('accountCtrl', ['$rootScope', '$scope', 'plentyyServices', '$state', 'loginService', '$firebaseSimpleLogin', function($rootScope, $scope, plentyyServices, $state, loginService, $firebaseSimpleLogin) {

  $scope.newAccount = {};
  $scope.createAccount = function() {
    $scope.err = null;

    if( assertValidInput() ) {
      loginService.createAccount($scope.newAccount, function(err, user) {
        if( err ) {
          $scope.err = err? err + '' : null;            
        }
        else {
            loginService.login($scope.newAccount.email, $scope.newAccount.pass);
            $scope.$on("$firebaseSimpleLogin:login", function() {
              $state.go('main.offersFeed');
            });              
        }
      });
    }
  };

  $scope.login = function(login, cb) {
    $scope.err = null;
    if( !$scope.login.email ) {
      $scope.err = 'Please enter an email address';
    }
    else if( !$scope.login.pass ) {
      $scope.err = 'Please enter a password';
    }
    else {
      loginService.login($scope.login.email, $scope.login.pass, function(err, user) {
        $scope.err = err? err + '' : null;
        if( !err ) {
           cb && cb(user);
        }
      });
    }
    $state.go('main.offersFeed');
  };

  function assertValidInput() {
    if( !$scope.newAccount.email ) {
      $scope.err = 'Please enter an email address';
    }else if( !$scope.newAccount.pass ) {
      $scope.err = 'Please enter a password';
    }else if( $scope.newAccount.pass !== $scope.newAccount.confirm ) {
      $scope.err = 'Passwords do not match';
    }
    return !$scope.err;
  };

  $scope.backTo = [
    {
      type: 'button-clear',
      content: '<i class="icon ion-arrow-left-b"></i>',
      tap: function(e) {
        $state.go('login');
      }
    }
  ];

}]);
