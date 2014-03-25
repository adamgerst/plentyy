plentyyApp.directive('map', function(){
	return {
		restrict: 'EA',
		replace: true,
		priority: 100,
		template: '<div class="map"></div>',

		controller: function ($scope, $element, $attrs) {
			lat = $scope.lat;
			lon = $scope.lon;
			
			var mapOptions = {
				zoom: 14,
				center: new google.maps.LatLng(lat, lon),
				mayTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map($element[0], mapOptions);
		},
		
		link: function(scope, ele, attrs){
			var addMarker = function(lat, lon){
				var coor = new google.maps.LatLng(lat, lon);
				var marker = new google.maps.Marker({
					position: coor,
					map: scope.map
				});
			};
			addMarker(scope.lat, scope.lon);
		}
	}
});
