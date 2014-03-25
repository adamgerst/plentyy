var plentyyServices = angular.module('plentyyServices', ['ngResource']);

plentyyServices.cache = {};

plentyyServices.service('plentyyServices', 
 ['$http', '$q',
    function($http, $q) {

      var fetchData = function() {
          
        var url = 'http://socialmention.com/search?q=iphone+apps&f=json&t=microblogs&callback=JSON_CALLBACK';  

        var config = {
          cache: true
        };

        var d = $q.defer();

        $http.jsonp(url, config)
        .success(function(data, status, headers) {
          d.resolve(data);
        })
        .error(function(data, status, headers) {
          d.reject(data);
        });

        return d.promise;
      }

    return {
      fetchData: fetchData
    }
}]);