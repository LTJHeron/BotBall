/*global define, pubsub */

define(['Utilities/pubsub', 'Modules/canvas'], function () {
	'use strict';

	var args = Array.prototype.slice.call(arguments),
		Canvas = args[1];

	/**
		Subclass of canvas, responsible for rendering the players
	*/
	function Players () {

		this.botWidth = 20;
		this.botHeight = 20;

		var that = this;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/render', function (message, data) {
			that.movePlayers(data);
		});
	}

	Players.prototype = new Canvas(document.getElementById('players'));
	Players.prototype.constructor = Players;

	Players.prototype.movePlayers = function(data) {

		var game = data.gameData,
			move = data.moveCount,
			currentStep,
			xPos, yPos,
			gameMove = game.gameSequence[move];

		this.clearCanvas(this.canvasWidth, this.canvasHeight);

		/**
		* Plot bot positions
		*/

		//PLAYER 1
		for (currentStep = 0; currentStep < gameMove.player0.length; currentStep++) {
			xPos = ((gameMove.player0[currentStep].split(',')[0]) * this.scale) + this.pitchStartingX;
			yPos = this.canvasHeight - ((gameMove.player0[currentStep].split(',')[1] * this.scale) + this.pitchStartingY);

			//Place the bots for PLAYER1
			this.context.fillStyle = this.primary0Colour;
			this.context.shadowColor = this.secondary0Colour;
			this.context.fillRect(xPos,yPos,this.botWidth,this.botHeight);
		}

		//PLAYER 2
		for (currentStep = 0; currentStep < gameMove.player1.length; currentStep++) {

			xPos = ((gameMove.player1[currentStep].split(',')[0]) * this.scale) + this.pitchStartingX;
			yPos = this.canvasHeight - ((gameMove.player1[currentStep].split(',')[1] * this.scale) + this.pitchStartingY);

			//Place the individual players
			this.context.fillStyle = this.primary1Colour;
			this.context.shadowColor = this.secondary1Colour;

			this.context.fillRect(xPos,yPos,this.botWidth,this.botHeight);
		}
	};

	return Players;
});