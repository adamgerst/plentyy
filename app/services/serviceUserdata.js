angular.module('serviceUserdata', ['firebase', 'serviceFirebase'])
  .factory('userDataService', ['$firebase', 'firebaseRef', '$q', '$rootScope',
    function($firebase, firebaseRef, $q, $rootScope) {
      var usersRef = firebaseRef('users');
      var users = $firebase(usersRef);

      return { 
        exists  : function(user) {
          var self = this;
          var d = $q.defer();

          firebaseRef('users/' + user.uid)
            .once('value', function(snap){
              d.resolve(snap.val());
          });
         
          d.promise
            .then(function(data){
              if(!data) {
                self.createByFacebook(user);
              }else{
              }
            });
        },

        createByFacebook : function(user){
          var userObj = {
            firstName       : user.first_name,
            userDump        : user,
            fbuserToken     : user.accessToken,
            locationHistory : [],       //https://www.firebase.com/docs/managing-lists.html
          };
          var d = $q.defer();
          firebaseRef('users').child(user.uid)
            .set(userObj, function(err){
              err ? d.reject() : d.resolve();
            });

          return d.promise;
        },
        
        createByEmail : function(obj){
          var d = $q.defer();
          firebaseRef('users').child(obj.authDump.uid)
            .set(obj, function(err){
              err ? d.reject() : d.resolve();
            });
            return d.promise;
        },

        getById : function(id){
          var d = $q.defer();
          firebaseRef('users/'+ id)
            .once('value', function(snap){
              d.resolve(snap.val());
            }, function(data){
              d.reject(data);
            }); 
          return d.promise;
        },

        getList : function(array){
          return $q.all(_.map(array, this.getById)); // note map takes third param of context
        },

        getAll : function() {
          var d = $q.defer();
          usersRef.once('value', function(snap) {
            d.resolve(snap.val());
          }, function(data) {
            d.reject(data);
          });
          return d.promise;
        },

      };

  }]);

