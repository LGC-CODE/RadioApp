app.controller('mainCtrl', [
	'$scope', 
	'$ionicLoading', 
	'$cordovaMedia', 
	'socket', 
	'$localStorage', 
	'$location', 
	 '$ionicScrollDelegate',
	 '$sce', function(
	 	$scope, $ionicLoading, $cordovaMedia, socket, 
	 	$localStorage, $location, $ionicScrollDelegate, $sce){
  

	document.addEventListener('deviceready', function(){
	  
			var media = "";
			var oneMinute = 1000 * 60;

			$scope.appStatus = function(status, msg){

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

			$scope.notifyUserOnDeactivate = function (){
				//notify users that current user has returned
					if($localStorage.person.person){
						socket.emit('send message', {			//send greeting data to server
							room: roomType,
							text: 'Regreso ' + $localStorage.person.person,
							from: 'Radio Chat',
							avatar: './../img/amarillo.png'
						});
					} else if(!$localStorage.person.person){
						console.log('no user');
					}
			}

			$scope.notifyUserOnActivate = function(){
				//notify users that current user has left
					if($localStorage.person.person){
						socket.emit('send message', {			//send greeting data to server
							room: roomType,
							text: 'Salio ' + $localStorage.person.person,
							from: 'Radio Chat',
							avatar: './../img/amarillo.png'
						});
					} else if(!$localStorage.person.person){
						console.log('no user');
					}
			}

			$scope.startMedia = function(status, msg) {
					media = new Media(
						'http://138.197.210.159:8000/stream.mp3',
			    		null, null, $scope.appStatus(status, msg)
			    	);

			    	return media;
			}
	  
			$scope.play = function(){

			  $scope.startMedia(2, 'button clicked: playing...').play();

			}
	  
			var appStatus =  function(msg){
				
			}
	  
			$scope.stop = function(){

				$scope.startMedia(4, 'button clicked: terminating audio').stop();

			}

			socket.emit('subscribe', roomType);
  });

//iphone event listener =====================================>

  document.addEventListener('resign', function(){
  		cordova.plugins.backgroundMode.enable();

			cordova.plugins.backgroundMode.onactivate = function() {

				$scope.startMedia( 2, 'apple audio active..').play();

				$scope.stop = function(){

				  	$scope.startMedia( 4, 'button clicked: terminating audio..').stop();

				}

				$scope.notifyUserOnActivate();

			};

			cordova.plugins.backgroundMode.ondeactivate = function() {
				$scope.startMedia( 4, 'turning off apple audio').stop();

				console.log('stopped');

				socket.emit('subscribe', roomType);		//join room

				$scope.notifyUserOnDeactivate();
			};

			cordova.plugins.backgroundMode.onfailure = function(errorCode) {

				console.log(errorCode);
			};
  });



  //android initial event listener ====================================>



  	document.addEventListener('pause',function(){

  		console.log('pause - eventListener triggered..');

  		cordova.plugins.backgroundMode.enable();

  		cordova.plugins.backgroundMode.onactivate = function() {

				$scope.startMedia( 2, 'starting android or apple audio..').play();

				$scope.notifyUserOnActivate();
		}

		cordova.plugins.backgroundMode.ondeactivate = function(){
			var performAction = confirm('Seguir Tocando Musica?');

			if(performAction){
				$scope.startMedia( 2, 'User Approved Audio Playback').play();
			} else {
				$scope.startMedia( 4, 'User Denied Audio Playback').stop();
			}

			$scope.notifyUserOnDeactivate();

			$scope.stop = function(){
				$scope.startMedia( 4, 'button clicked: stopping media').stop();
			}
		}

		cordova.plugins.backgroundMode.onfailure = function(errorCode) {
			console.log(errorCode);
			alert(errorCode);
		}

  	})

  //Chat Application =============================================>
  	//variables set here=====>

  	var roomType = 'Tigre Sonidero';
  	var username = {};
  	$scope.message = [];
  	$scope.url = "";
  	$scope.status = "";
  	$localStorage.person = "";

  	//=======================>

  	if($localStorage.person.person){

  		$scope.isLoggedIn = true;

  	} else if($localStorage.person === "") {

  		$scope.isLoggedIn = false;

  	} else {

  		$scope.isLoggedIn = false;

  	}

  	function User(username, typeOfPerson){

	   this.person = username;

	   this.gender = typeOfPerson;

	}

  	socket.emit('subscribe', roomType);		//join room

	//create user with name and avatar

	$scope.register = function(){

		if(!$scope.name){ 
			$scope.alert = "llena la seccion de nombre";

			setTimeout(function(){
				$scope.alert = false;  //hide alert
			}, 5000);

			return;	

		} else if(!$scope.gender){
			$scope.alert = "escoge una opcion de genero";

			setTimeout(function(){
				$scope.alert = false;  //hide alert
			}, 5000);

			return;	

		}

		username = new User($scope.name, $scope.gender);

		$localStorage.person = username; //save user to local storage

		$scope.isLoggedIn = true; //log in user i.e. show the message input
		
		$scope.url = $localStorage.person.gender; //assign picture url

	}

	//create message

	$scope.addMessage = function(){

		if(!$scope.text) { return; }

		socket.emit('send message', { 
			room: roomType,
			text: $scope.text,
			from: $localStorage.person.person,
			avatar: $scope.url
		});

		$scope.text = "";
	};

	//change name or log out

	$scope.logOut = function(){
		$localStorage.person = "";
		$scope.isLoggedIn = false;
	}

  	socket.on('private', function(data){		//update view 
		$scope.message.push({
			text: data.text,					//display text and name
			fromUser: data.from,
			room: data.room,
			avatar: data.avatar
	 	});

		//Scroll Effect
	 	$ionicScrollDelegate.$getByHandle('small').scrollBottom(true);
	});

}]);