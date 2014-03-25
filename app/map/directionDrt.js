plentyyApp.directive('mapDirection', function(){
	return {
		restrict: 'EA',
		transclude: true,
		template: '<map id="map_canvas" class="map"></map>',
		link: function(scope, element, attrs) {
			scope.userLat;
			var map = scope.map;
			var directionsDisplay;
			directionsDisplay = new google.maps.DirectionsRenderer();
			directionsDisplay.setMap(map);
			var directionsService = new google.maps.DirectionsService();

			var start = new google.maps.LatLng(scope.userLat, scope.userLon);
			var end = new google.maps.LatLng(scope.lat, scope.lon);
			var request ={
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};

			var loadRoute = directionsService.route(request, function(result, status){
				if (status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(result);
				}
			});
		}
	}
})