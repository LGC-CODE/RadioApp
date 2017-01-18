app.controller('mainCtrl', [
	'$scope', 
	'$ionicLoading', 
	'$cordovaMedia', 
	'socket', 
	'$localStorage', 
	'$location', 
	'$ionicScrollDelegate',
	'mediaFile',
	  function(
		$scope, $ionicLoading, $cordovaMedia, socket, 
		$localStorage, $location, $ionicScrollDelegate, mediaFile){
  

	document.addEventListener('deviceready', function(){
	  
			var media = "";
			var speakerLeft = document.getElementById('speaker-left');
			var speakerRight = document.getElementById('speaker-right');
			var audioMp3 = mediaFile.media();
			var userChoice;
			$scope.imgSrc = './img/amarillo.png';
			console.log(mediaFile.msg);
			console.log(ionic.Platform.platform());


			$scope.speakerOn = function(){
				speakerLeft.classList.add('speaker-on');
				speakerRight.classList.add('speaker-on');
			}

			$scope.speakerOff = function(){
				speakerLeft.classList.remove('speaker-on');
				speakerRight.classList.remove('speaker-on');
			}

			$scope.scrollToButtons = function(){

				$location.hash('anchorPoint');      
     			$ionicScrollDelegate.anchorScroll(true); 

				console.log('clicked');
			}

			$scope.notifyUserOnDeactivate = function (){
				//notify users that current user has returned
					if($localStorage.person.person){
						socket.emit('send message', {			//send greeting data to server
							room: roomType,
							text: 'Regreso ' + $localStorage.person.person,
							from: 'Radio Chat',
							avatar: $scope.imgSrc
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
							avatar: $scope.imgSrc
						});
					} else if(!$localStorage.person.person){
						console.log('no user');
					}
			}
	  
			$scope.play = function(){

				mediaFile.userChoice = true;

				console.log( mediaFile.userChoice );

				mediaFile.successMsg(2, 'button clicked: starting audio...');

				audioMp3.play();

				$scope.speakerOn();

			}
	  
			$scope.stop = function(){

				mediaFile.userChoice = false;

				console.log( mediaFile.userChoice );

				mediaFile.successMsg(4, 'button clicked: terminating audio... 1');

				audioMp3.stop();

				audioMp3.release();

				$scope.speakerOff();

			}

			socket.emit('subscribe', roomType);
  });

//iphone event listener =====================================>

  // document.addEventListener('resign', function(){
		// cordova.plugins.backgroundMode.enable();

		// 	cordova.plugins.backgroundMode.onactivate = function() {

		// 		$scope.startMedia( 2, 'apple audio active..').file.play();

		// 		$scope.speakerOn();

		// 		$scope.stop = function(){
				
		// 			$scope.startMedia( 4, 'button clicked: iphone terminating audio..').file.play();

		// 			$scope.startMedia( 4, 'button clicked: iphone terminating audio..').file.stop();

		// 		}

		// 		$scope.notifyUserOnActivate();

		// 	};

							
		// 	cordova.plugins.backgroundMode.ondeactivate = function() {
		// 		$scope.startMedia( 4, 'turning off apple audio').file.stop();

		// 		$scope.speakerOff();

		// 		socket.emit('subscribe', roomType);		//join room

		// 		$scope.notifyUserOnDeactivate();
		// 	};

		// 	cordova.plugins.backgroundMode.onfailure = function(errorCode) {

		// 		console.log(errorCode);
		// 	};
  // });



  //android initial event listener ====================================>



	document.addEventListener('pause',function(){

		console.log('pause - eventListener triggered..');

		var audioMp3 = mediaFile.media();

		cordova.plugins.backgroundMode.enable();

		cordova.plugins.backgroundMode.onactivate = function() {

				console.log('started background');

				console.log( mediaFile.userChoice );


				if(ionic.Platform.platform() === 'ios' && mediaFile.userChoice === true){

					audioMp3.play();
					$scope.speakerOn();

				} else if( mediaFile.userChoice === false ){

					$scope.speakerOff();
				}

				$scope.notifyUserOnActivate();
		}

		cordova.plugins.backgroundMode.ondeactivate = function(){
			console.log('coming back..');
			$scope.notifyUserOnDeactivate();

		}

		cordova.plugins.backgroundMode.onfailure = function(errorCode) {
			console.log(errorCode);
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
				$scope.$apply(function(){
					$scope.alert = false;     //hide alert
				});
			}, 5000);

			return;	

		} else if(!$scope.gender){
			$scope.alert = "escoge una opcion de genero";

			setTimeout(function(){
				$scope.$apply(function(){
					$scope.alert = false;
				}); 						//hide alert
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