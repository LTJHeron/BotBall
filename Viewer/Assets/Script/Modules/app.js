/*global define, pubsub, gameData */

define([
	'Utilities/pubsub',
	'Modules/audio_player',
	'Modules/ball',
	'Modules/players',
	'Modules/text',
	'Modules/pitch'
],
function () {
	'use strict';

	var args = Array.prototype.slice.call(arguments),
		AudioPlayer = args[1],
		BallCanvas = args[2],
		PlayersCanvas = args[3],
		TextCanvas = args[4],
		PitchCanvas = args[5];

	/**
		Application - a kind of control / interface between the view and
		the Canvas classes
		@param, options, optional, an object of overrite properties
	*/

	function App (options) {

		options = options || {};

		var that = this;

		this.paused = options.paused || false;
		this.gameSteps = options.gameSteps || 1;
		this.moveCount = options.moveCount || -1;
		this.gameData = {};
		this.forward = options.forward || true;
		this.delayGameStepsBy = null;
		this.gameSpeed = options.gameSpeed || 200;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/score', function () {
			if (that.paused !== true) {
				clearInterval(that.delayGameStepsBy);
				that.paused = true;

				setTimeout(function () {
					that.startGame();
					that.paused = false;
				}, 1100);
			}
		});
	}


	/**
		Starts the game
	*/
	App.prototype.startGame = function () {
		var that = this;

		this.delayGameStepsBy = setInterval(function (){
			that.loopData(true);
		}, this.gameSpeed);
	};

	/**
		Ends the game
	*/
	App.prototype.endGame = function () {

		clearInterval(this.delayGameStepsBy);
		this.paused = true;

		pubsub.publish('game/end');
	};

	/**
		Loops through the JSON object and incrementes the game state
	*/
	App.prototype.loopData = function(forward) {
		if (forward !== true) {
			this.gameSteps--;
		} else {
			this.gameSteps++;
		}

		this.startMoving(forward);

		if(this.gameSteps > this.gameData.gameSequence.length){
			this.endGame();
		}
	};

	/**
		Renders new game state
		@param, forward, required, instructs whether to render the next or previous game state
	*/
	App.prototype.startMoving = function (forward) {

		if (forward !== true) {
			if (this.moveCount === 0){
				this.moveCount = 0;
			} else {
				this.moveCount = this.moveCount - 1;
			}
		} else {
			this.moveCount++;
		}

		pubsub.publish('game/render', {
			'gameData': this.gameData,
			'moveCount': this.moveCount,
			'forward': forward
		});
	};

	/**
		Retrieves the game data
	*/
	App.prototype.retrieveData = function () {

		var that = this;

		if(!gameData) {
			console.log('Game data not defined. Have you played a game yet?');
			return;
		}

		that.gameData = gameData;
		that.initialiseObjects();
		that.startGame();

	};

	/**
		Initialise all the objects needed
	*/
	App.prototype.initialiseObjects = function () {
		var pitch = new PitchCanvas(),
			players = new PlayersCanvas(),
			ball = new BallCanvas(),
			text = new TextCanvas(),
			audioPlayer = new AudioPlayer();
	};

	return App;

});
