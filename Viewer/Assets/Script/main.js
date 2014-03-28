require(['jquery',
	'Modules/app'
	],
	function($, App) {
		'use strict';


		var application = new App();

		/**
			Pauses the game
		*/
		function pauseGame (event) {
			event.preventDefault();

			clearInterval(application.delayGameStepsBy);
			application.paused = true;

			detachEvent('.gameControls .pauseGame', pauseGame);
			attachEvent('.gameControls .playGame', playGame);
			attachEvent('.gameControls .stepForward', stepForward);
			attachEvent('.gameControls .stepBackward', stepBackward);
		}

		/**
			Begins the game playing again at the game speed
		*/
		function playGame (event){
			event.preventDefault();

			application.startGame();
			application.paused = false;

			attachEvent('.gameControls .pauseGame', pauseGame);
			detachEvent('.gameControls .playGame', playGame);
			detachEvent('.gameControls .stepForward', stepForward);
			detachEvent('.gameControls .stepBackward', stepBackward);
		}

		/**
			Moves the game forward by one game step
		*/
		function stepForward (event){
			event.preventDefault();

			application.paused = true;

			setTimeout(function (){
				application.loopData(true);
			}, application.gameSpeed);
		}

		/**
			Moves the game backward by one game step
		*/
		function stepBackward (event) {
			event.preventDefault();

			application.paused = true;

			setTimeout(function () {
				application.loopData(false);
			}, application.gameSpeed);
		}

		/**
			Attaches a click event to a given element and removes the disabled class
			@param, selector, required, the dom element to attach the event
			@param, method, required, the method that will be attached to the element
		*/
		function attachEvent (selector, method) {
			document.querySelectorAll(selector)[0].addEventListener('click', method);
			document.querySelectorAll(selector)[0].classList.remove('disabled');
		}

		/**
			Removes a click event
			@param, selector, required, the dom element to remove the event from
			@param, method, required, the method to detach from the element
		*/
		function detachEvent (selector, method) {
			document.querySelectorAll(selector)[0].removeEventListener('click', method);
			document.querySelectorAll(selector)[0].classList.add('disabled');
		}

		$(document).ready(function() {
			application.retrieveData();

			attachEvent('.gameControls .pauseGame', pauseGame);
		});

	}
);