angular.module('serviceDealData', ['firebase', 'serviceFirebase',
  'serviceGeofire'])
  .factory('dealDataService', ['$firebase', '$q', 'firebaseRef', 'geoFirebaseService',
    function($firebase, $q, firebaseRef, geoFirebaseService, transactionService) {


      var root = firebaseRef();
      var dealsRef = firebaseRef('deals');
      var geo = geoFirebaseService();

      //////////////////
      //Helper functions
      //////////////////

      var createDeal = function(deal) {
        var d = $q.defer();
        var id = root.child('/deals').push();
        id.set(deal, function(err) {
          if(!err) {
            d.resolve({id: id, deal: deal});
          } else {
            console.error('deal create failed');
            d.reject();
          }
        });
        return d.promise;
      };

      var deleteDeal = function(dealId) {
        var d = $q.defer();
        firebaseRef('deals/' + dealId).remove(function(err) {
          if(!err) {
            d.resolve();
          } else {
            console.error('deal delete failed');
            d.reject();
          }
        });
        return d.promise;
      };

      var addDealInMerchant = function(data) {
        var d = $q.defer();
        var deal = data.deal;
        var name = data.id.name();
        root.child('/merchants/' + deal.merchantId + '/deals/' + name).set(true, function(err) {
          if(!err) {
            d.resolve({name: name, deal: deal});
          } else {
            console.error('add deal key to merchant failed');
            d.reject();
          }
        });
        return d.promise;
      };

      var deleteDealInMerchant = function(merchantId, dealId) {
        var d = $q.defer();
        root.child('/merchants/' + merchantId + '/deals/' + dealId).remove(function(err) {
          if(!err) {
            d.resolve();
          } else {
            console.error('deal delete in merchant failed');
            d.reject();
          }
        });
        return d.promise;
      };


      ////////////////////////////////////////
      //Deal object with exposed API functions
      ////////////////////////////////////////

      var Deal = {

        geoInsertByLocWithId: function(dealId, deal) {
          delete deal.image;
          var d = $q.defer();
          deal.id = dealId; //Insert the id in the deal object to retrieve it later when searching by location
          geo.insertByLocWithId(deal.location, dealId, deal, function(err) {
            if(!err) {
              d.resolve();
            } else {
              console.error('add deal in geo collection failed');
              d.reject();
            }
          });
          return d.promise;
        },

        geoRemoveById: function(dealId) {
          var d = $q.defer();
          geo.removeById(dealId, function(err) {
            if(!err) {
              d.resolve();
            } else {
              console.error("Geo remove failed!");
              d.reject();
            }
          });
          return d.promise;
        },

        getAll: function() {
          var d = $q.defer();
          dealsRef.once('value', function(snap) {
            d.resolve(snap.val());
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },

        getById: function(dealId) {
          var d = $q.defer();
          firebaseRef('deals/' + dealId).once('value', function(snap) {
            var obj = {};
            obj[dealId] = snap.val();
            d.resolve( obj);
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },

        getImageById: function(dealId) {
          var d = $q.defer();
          firebaseRef('deals/' + dealId).once('value', function(snap) {
            d.resolve(snap.val().image);
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },

        getManyById : function(arrayOfIds){
          var self = this;
          var d = $q.defer();
           
            $q.all(_.map(arrayOfIds, function(val){
              return self.getById(val);
            }, self))
            .then(function(data){
              //convert array of items into object
              var obj = {};
              _.each(data, function(item){
                _.extend(obj, item)
              })
              d.resolve(obj);
            });
          
          return d.promise;
        },

        getByMerchantId : function(merchantId){
         var self = this;
          var d1 = $q.defer();
          //first get array of a merchant's dealsIds
          root.child('merchants/'+ merchantId + '/deals/')
            .once('value', function(snap){
              d1.resolve( snap.val() );
            }, function(data){
              d1.reject(data);
            });

          var d2 = $q.defer();
           
          d1.promise.then(function(list){
            $q.all(_.map(list, function(val,key){
              return self.getById(key);
            }, self))
            .then(function(data){
              //convert array of items into object of objects
              var obj = {};
              _.each(data, function(item){
                _.extend(obj, item)
              })
              d2.resolve(obj);
            });
          });

          return d2.promise;
        },

        //OLD VERSION OF THE FUNCTION 'getActiveByUserLocation'
        //To be commented when transactionService.getAllByUserId is ready
        getActiveByUserLocation : function(userLocation, radius) {
          var d = $q.defer();
          var self = this;
          geo.getPointsNearLoc(userLocation, radius, function(arrayOfDeals) {
            var objContainer = {};
            _.each(arrayOfDeals, function(deal) {
              var id = deal.id;
              delete deal.id;
              var endDateTime = Date.parse(deal.endDateTime);
              if(endDateTime > Date.now()) {
                //Add walking, driving and transit duration in the deal
                objContainer[id] = deal;
              }
            });
            d.resolve(objContainer);
          });
          return d.promise;
        },
         
        getQuantityById: function(dealId) {
          return $firebase(firebaseRef('deals/' + dealId + '/quantity'));
        },

        create: function(deal) {
          var d1 = $q.defer();
          var self = this;
          //Create deal
          createDeal(deal)
          .then(function(data) {
            //Add a deal key in the merchant/deal object
            return addDealInMerchant(data);
          }, function() {console.error('Error creating deal');
          })
          .then(function(data) {
            //If active deal, put it in the geo location collection
            var d2 = $q.defer();
            if(deal.status.name === 'Active') {
              self.geoInsertByLocWithId(data.name, data.deal)
              .then(function() {
                d2.resolve();
              }, function() {
                d2.reject();
              });
            } else {
              d2.resolve();
            }
            return d2.promise;
          }, function() {console.error('Error adding a deal key in merchant');
          })
          .then(function() {
            d1.resolve();
          }, function() {console.error('Error adding the deal in geo collection');
          });
          return d1.promise;
        },

        update: function(dealId, deal) {
          var d = $q.defer();
          firebaseRef('deals/' + dealId).set(deal, function(err) {
            err ? d.reject() : d.resolve();
          });
          return d.promise;
        },

        delete: function(dealId, deal) {
          var d1 = $q.defer();
          var self = this;
          //Deleting the deal in the deals object
          deleteDeal(dealId)
          .then(function() {
            //Deleting the deal key in the merchants/deals object
            return deleteDealInMerchant(deal.merchantId, dealId);
          }, function() {console.error('Delete deal failed');
          })
          .then(function() {
            //If active deal, delete it from the geo location collection
            var d2 = $q.defer();
            if(deal.status.name === 'Active') {
              self.geoRemoveById(dealId)
              .then(function() {
                d2.resolve();
              }, function() {
                d2.reject();
              });
            } else {
              d2.resolve();
            }
            return d2.promise;

          }, function() {console.error('Delete deal in merchant failed');
          })
          .then(function() {
            d1.resolve();
          }, function() {console.error('Error deleting the deal in the geo location');
          });
          return d1.promise;
        }

      };

      ////////////////////////
      //Return the deal object
      ////////////////////////

      return Deal;

    }]);
