angular.module('indexCtrlModule', ['serviceLogin'])

.controller('indexCtrl', ['$scope', '$timeout', 'loginService', '$rootScope', '$firebaseSimpleLogin', '$firebase', '$state', 'waitForAuth', function($scope, $timeout, loginService, $rootScope, $firebaseSimpleLogin, $firebase, $state, waitForAuth) {

  $scope.checkauth = function() {
    $timeout(function() {
      if($rootScope.auth.user !== null) {
        $state.go('main.offersFeed');  
      } else {
        $state.go('login');  
      }
    }, 3000);
  };  

  $scope.fblogin = function() {
    loginService.fblogin();
    $scope.$on("$firebaseSimpleLogin:login", function() {
      $state.go('main.offersFeed');
    });
  };

	$scope.inhouselogin = function() {
		loginService.login($scope.email, $scope.pass)
	};

  $scope.logout = function() {
    loginService.logout();
    $scope.$on("$firebaseSimpleLogin:logout", function() {
      $state.go('login');
    });
  };   

  $scope.getWidth = function() {
    return window.innerWidth * 0.75;
  };

}])