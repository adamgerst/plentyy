angular.module('serviceTransactionData', ['firebase', 'serviceFirebase', 'serviceDealData'])
  .factory('transactionService', ['$firebase', 'firebaseRef', '$q', '$rootScope', 'dealDataService',
    function($firebase, firebaseRef, $q, $rootScope, dealDataService) {
      
      var transRef = firebaseRef('transactions');
      var root = firebaseRef();
      var onComplete = function(err){
        if (err){ console.error('Firebase operation failed.'); 
        } else { console.error('Firebase operation succeeded.'); }
      };
    
      //////////////////
      //Helper functions
      //////////////////   

      var updateDealQuantity = function(dealId, change){
        var ref = firebaseRef('deals/' + dealId + '/quantity');
        ref.once('value', function(snap) {
          var updateQuantity = change === 'down' ? snap.val()-1 : snap.val()+1;
            ref.set(updateQuantity, function(err){
              if (!err){
                updateGeo(dealId, updateQuantity);
              } else{
                console.error('Error updating quantity', err);
              }
            });
          }, function(err) {
            console.error(err);
          });
      };

      var updateGeo = function(dealId, quantity){
        var ref = firebaseRef('geo/geoFire/dataById/');
        dealDataService.geoRemoveById(dealId);
        
        if (quantity > 0){
          firebaseRef('deals/' + dealId)
            .once('value', function(snap){
              dealDataService.geoInsertByLocWithId(dealId, snap.val());
            }, function(err){
              console.error(err);
            }); 
        }
        if (quantity < 0){
          console.error("Yo! quantity should not be less than 0", quantity, 'for',dealId);
        }
      };

      /////////////////////////////////////////////////
      //Transaction functions for exposed API 
      /////////////////////////////////////////////////

     return {
          create : function(obj){
            var d = $q.defer();
            var id = root.child('/transactions').push();
            var transId = id.name();
            obj.transId = transId;
            id.set(obj, function(err) {
            if (!err){
              d.resolve();
              //add transaction data to user collection
              root.child('users/'+ obj.userId+ '/transactions/')
                  .child(transId + '/status/').set('clicked');
              root.child('users/'+ obj.userId+ '/activeTransactions/' + transId )
                .set({'transactionId': transId,'dealId' : obj.dealId});
              //add transaction data to merchant collection
              root.child('merchants/'+ obj.merchantId+ '/transactions/')
                  .child(transId + '/status/').set('clicked');
              //add transaction data to deal collection
              root.child('deals/'+ obj.dealId + '/transactions/')
                  .child(transId + '/status/').set('clicked');
              updateDealQuantity(obj.dealId, 'down');
            }else{
              d.reject();
            }
          });
          return d.promise;
        },

        getByTransactionId : function(id){
          var d = $q.defer();
          firebaseRef('transactions/'+ id)
            .once('value', function(snap){
              var obj = {};
              obj[id] = snap.val();
              d.resolve( obj);
            }, function(err){
              d.reject(err);
            }); 
          // data returned is {id : {stuff} }
          return d.promise;
        },

        getByUserId : function(userId, active){
          var transStatus = active ? 'activeTransactions' : 'transactions';
          var self = this;
          var d1 = $q.defer();
          //first get array of a user's transactionIds
          root.child('users/'+ userId + '/' + transStatus + '/')
            .once('value', function(snap){
              d1.resolve( snap.val() );
            }, function(err){
              d1.reject(err);
            });

          var d2 = $q.defer();
           
          d1.promise.then(function(list){
            $q.all(_.map(list, function(val,key){
              return self.getByTransactionId(key);
            }, self))
            .then(function(data){
              var obj = {};
              _.each(data, function(trans){
                var transId = Object.keys(trans);
                // this is a hack to return non-expired deals, in future do DB cleanup
                if (active === 'active'){
                  var endDateTime = Date.parse((trans[transId].endDateTime));
                  if(endDateTime > Date.now()) {
                    _.extend(obj, trans);
                  }
                }else{
                  _.extend(obj, trans);
                }
              })
              d2.resolve(obj);
            });
          });

          return d2.promise; 
        },

        getByMerchantId : function(merchId){
         var self = this;
          var d1 = $q.defer();
          //first get array of a merchant's transactionIds
          root.child('merchants/'+ merchId + '/transactions/')
            .once('value', function(snap){
              d1.resolve( snap.val() );
            }, function(err){
              d1.reject(err);
            });

          var d2 = $q.defer();
           
          d1.promise.then(function(list){
            $q.all(_.map(list, function(val,key){
              return self.getByTransactionId(key);
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

        getAll : function(){
         var d = $q.defer();
          transRef.once('value', function(snap) {
            d.resolve(snap.val());
          }, function(err) {
            d.reject(err);
          });
          return d.promise;
        },

        update : function(transId, obj, statusFlag){ 
          var d = $q.defer();
          firebaseRef('transactions/' + transId).set(obj, function(err) {
            err ? d.reject() : d.resolve();
          });

          if (statusFlag === 'canceled'){
            updateDealQuantity(obj.dealId,'up');
            root.child('users/'+ obj.userId+ '/activeTransactions/' + transId ).remove();
            root.child('users/'+ obj.userId+ '/transactions/' + transId ).remove();

          }
          if (statusFlag === 'pickedup'){
            root.child('users/'+ obj.userId+ '/activeTransactions/' + transId ).remove();
          }

          return d.promise;
        },

        delete : function(){
          var d = $q.defer();
    
          //Delete from transactions
          firebaseRef('transactions/' + id).remove(function(err) {
            if(!err) {
              //Deleting from merchants
              root.child('/merchants/' + merchantId + '/transactions/' + transId).remove(function(err) {
                err ? d.reject() : d.resolve();
              });
              //Deleting from users
              root.child('/users/' + userId + '/transactions/' + transId).remove(function(err) {
                err ? d.reject() : d.resolve();
              });              
            } else {
              d.reject();
            }
          });
          return d.promise;
        }
      };   

   }]);
