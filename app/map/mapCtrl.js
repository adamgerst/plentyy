angular.module('mapCtrlModule', ['ngResource', 'plentyyServices', 'serviceGeoGoogle'])

.controller('mapCtrl', ['$rootScope', '$scope', 'plentyyServices', '$state', 'geoGoogleService', 'passInfoService',
	function($rootScope, $scope, plentyyServices, $state, geoService, passInfoService) {

		$scope.geo = false;	

		var merLoca = passInfoService.retrieveInfo('deal').location
		$scope.lat = merLoca[0];
		$scope.lon = merLoca[1];
		$scope.geo = true;

		geoService.getUserPo()
		.then(function(data){
			$scope.userLat = data.latitude;
			$scope.userLon = data.longitude;
			$scope.userGeo = true;	
		})

	  $scope.goTo = function(path) {
	    $state.go(path);
	  }

  	$scope.backTo = [
      {
        type: 'button',
        content: '<i class="icon ion-arrow-left-b"></i>',
        tap: function(e) {
          $state.go('dealPage');
        }
      }
    ];  
}]);
