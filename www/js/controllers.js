app.controller('mainCtrl', ['$scope', '$ionicLoading', '$cordovaMedia', 'socket', '$localStorage', function($scope, $ionicLoading, $cordovaMedia, socket, $localStorage){
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

  //Chat Application

  	var roomType = 'Tigre Sonidero';
  	var username = {};
  	$scope.message = [];
  	$scope.status = "";

  	if($localStorage.person.person){
  		$scope.isLoggedIn = true;
  	} else if($localStorage.person === "") {
  		$scope.isLoggedIn = false;
  	}

  	function User(username, typeOfPerson){
	   this.person = username;
	   this.gender = typeOfPerson;
	}

  	socket.emit('subscribe', roomType);
	socket.emit('send message', {			//send greeting data to server
		room: roomType,
		text: 'Bienvenidos al Chat de Tigre Sonidero',
		from: 'Radio Chat'
	});

	$scope.register = function(){
		username = new User($scope.name, $scope.gender);
		$localStorage.person = username;
		$scope.isLoggedIn = true;
		$scope.url = $localStorage.person.gender;
	}

	$scope.addMessage = function(){

		if(!$scope.text) { return; }

		socket.emit('send message', { 
			room: roomType,
			text: $scope.text,
			from: $localStorage.person.person
		});

		$scope.text = "";
	};

	$scope.logOut = function(){
		$localStorage.person = "";
		$scope.isLoggedIn = false;
	}

  	socket.on('private', function(data){		//update view 
		$scope.message.push({
			text: data.text,					//display text and name
			fromUser: data.from,
			room: data.room
	 	});
	});


}]);