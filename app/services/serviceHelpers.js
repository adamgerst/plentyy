angular.module('serviceHelpers', [])
  .service('confCodeService', function(){
    var makeCode = function(len){
      var text = "";
      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < len; i++ ){
        text += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return text;
    }; 
    return { code : makeCode(7) };
  })

  .service('dealsService', function(){
    var calcDis = function(userLat, userLong, merchLat, merchLong) {
      var toRad = function(x) {
        return x * Math.PI / 180;
      };
      var R = 6371; // km
      var dLat = toRad(merchLat-userLat);
      var dLon = toRad(merchLong-userLong);
      var userLat = toRad(userLat);
      var userLong = toRad(userLong);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(userLat) * Math.cos(merchLat); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;

      return (d * 0.621371).toFixed(1); //convert to miles
    };

    var fetchDeals = function(data, container, all){
      var result = [];
      _.each(data, function(deal, dealID){
        deal.distance = calcDis(container.userLocation[0], container.userLocation[1],
          deal.location[0], deal.location[1]);
        if (all){
          deal.dealId = dealID;
        }
        result.push(deal);
      });
      return result;
    };
    return {calcDis: calcDis, fetchDeals: fetchDeals};
  });

 
