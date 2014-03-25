var geoServiceModule = angular.module('geoServiceModule', ['ngResource']);

geoServiceModule.service('geoService', 
	['$http', '$q', 
	function($http, $q) {
		var fetchData = function(address){
			var apiKey ='AIzaSyD6ta21eMx5Nxi4PDozFSKta3fkMZh06TM';
			var d = $q.defer();
			var url ="https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true"; 

			$http.get(url)
			.success(function(data, status, headers){

				var data = data;
				var lat =data.results[0].geometry.location.lat;
        d.resolve(data);
			})
      .error(function(data, status, headers) {
				console.error('error')
        d.reject(data);
      });
      return d.promise;
    };

    var getUserPo = function(){
    	var d = $q.defer();
    	var onSuccess = function(position) {
				d.resolve(position.coords);
			};

			var onError = function (error) {
			  console.error('code: '+ error.code + ';'+ 'message: ' + error.message);
			 	d.reject(error);
			};

			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			return d.promise;
    }

    return {fetchData: fetchData, getUserPo: getUserPo};
  }

]);


// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true_or_false&key=API_KEY


	// .constant('apiKey', 'AIzaSyCTMxNH5qf9VYlAueWbCo7sxGZxxuUKDv8')