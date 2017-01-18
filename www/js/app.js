// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'admobModule'])

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
		if( AdMob ){
			var admob_key = {
				android: "ca-app-pub-3883039043389376/3446448364",
				ios: "ca-app-pub-3883039043389376/3725649968"
			}

			if(device.platform == 'Android'){
				AdMob.createBanner({
					adId: admob_key.android,
					position: AdMob.AD_SIZE.SMART_BANNER, 
              		autoShow: true,
              		isTesting: false
				});
			} else if(device.platform == 'iOS'){
				AdMob.createBanner({
					adId: admob_key.ios,
					position: AdMob.AD_SIZE.SMART_BANNER, 
              		autoShow: true,
              		isTesting: false
				});
			}
		} else {
			console.log('no plugin');
		}
	});
})




