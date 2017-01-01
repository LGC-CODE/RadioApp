// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.controller('mainCtrl', ['$scope', '$ionicLoading', '$cordovaMedia', function($scope, $ionicLoading, $cordovaMedia){
  document.addEventListener('deviceready', function(){
      function checkConnection() {
          var networkState = navigator.connection.type;

          var states = {};
          states[Connection.UNKNOWN]  = 'Unknown connection';
          states[Connection.ETHERNET] = 'Ethernet connection';
          states[Connection.WIFI]     = 'WiFi connection';
          states[Connection.CELL_2G]  = 'Cell 2G connection';
          states[Connection.CELL_3G]  = 'Cell 3G connection';
          states[Connection.CELL_4G]  = 'Cell 4G connection';
          states[Connection.CELL]     = 'Cell generic connection';
          states[Connection.NONE]     = 'No network connection';

          alert('Connection type: ' + states[networkState]);
      }

            var media = "";
      
            $scope.play = function(src){
              console.log(src);
              media = new Media(src, null, null, appStatus);
              media.play();
            }
      
            var appStatus =  function(progress){
              if(progress == 2){
                $ionicLoading.show({ template: 'Cargando...!' });
      
                setTimeout(function(){
                  $ionicLoading.hide();
                }, 1200);
                
              } else if(progress == 4){
                $ionicLoading.show({ template: 'Gracias por escuchar...' });
      
                setTimeout(function(){
                  $ionicLoading.hide();
                }, 1200);
      
              }
            }
      
            $scope.stop = function(){
              media.stop();
              checkConnection();
            }
  });
}]);


