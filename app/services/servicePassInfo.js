angular.module('servicePassInfo', [])
	.service('passInfoService', function(){
		var infoStorage = {};
		
		var storeInfo = function(info, key){
			infoStorage.key = info;
		};

		var retrieveInfo = function(key){
			return infoStorage.key;
		};

		return {storeInfo : storeInfo, retrieveInfo : retrieveInfo};
	});
