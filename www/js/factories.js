app.factory('socket', function ($rootScope) {

	var hostURL = 'http://rockstarim.luisconstante.com/';
	var socket = io.connect(hostURL);
	console.log(hostURL, '<<<<! host name ');
	
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.factory('mediaFile', ['$cordovaMedia', '$ionicLoading', function($cordovaMedia, $ionicLoading){
	var success = function(status, msg){
		if(status == 2){
			$ionicLoading.show({ template: 'Cargando...!' });
  
			setTimeout(function(){
				$ionicLoading.hide();
			}, 1200);
			
		} else if(status == 4){
			$ionicLoading.show({ template: 'Gracias por escuchar...' });

			setTimeout(function(){
				$ionicLoading.hide();
			}, 1200);

		}

		console.log(msg);
	}

	var mediaStatus = function(stat){
		console.log(stat);
		return stat;
	}

	var file = function(){
		var audioFile = new Media('http://138.197.210.159:8000/stream.mp3', success, function(err){
			console.log(err.code, ' current error');
		}, 

		function(status){
			console.log(status, ' current status');
		});

		return audioFile;
	}	

	var userAuth = function(user){

		if(user === 'yes'){

			return true;

		} else if(user === 'no'){

			return false;

		}
	}

	return {
			media: file,
			msg: 'plugin ready',
			audioStatus: mediaStatus,
			successMsg: success,
			userChoice: ""
		}
}]);




