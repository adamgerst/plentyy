angular.module('serviceLogin', ['firebase', 'serviceFirebase', 'serviceUserdata'])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef',
    'userDataService', '$timeout',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, userDataService, $timeout) {
         var auth = null;
         return {
            init: function() {
              auth = $firebaseSimpleLogin(firebaseRef());
              return auth;
            },

            login: function(email, pass) {
               assertAuth();
               auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true })
               .then(function(user) {
                  }, function(err){
                });
            },
   
            fblogin : function() {
              assertAuth();
                auth.$login('facebook')
                  .then(function(user){
                    userDataService.exists(user); 
                    }, function(err){
                      console.error('Facebook vaildation error:', err);
                  });
            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            createAccount: function(obj, callback) {
              assertAuth();
              auth.$createUser(obj.email, obj.pass)
                .then(function(user) { 
                  delete obj.password
                  delete obj.confirm
                  obj.authDump = user;
                  obj.firebaseAuth = user.firebaseAuthToken;
                  userDataService.createByEmail(obj);
                  callback && callback(null, user) }, function(err){
                    console.error('err', err);
                  });
            }
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }]);
