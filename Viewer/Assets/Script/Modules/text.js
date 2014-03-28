/*global define, pubsub */

define(['Utilities/pubsub', 'Modules/canvas'], function () {
	'use strict';

	var args = Array.prototype.slice.call(arguments),
		Canvas = args[1];

	/**
		Subclass of canvas, controls the rendering of text elements
	*/
	function TextCanvas () {

		this.font = '"Orbitron",Tahoma,Geneva,Verdana,sans-serif';

		var that = this;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/end', function () {
			that.renderEndGameText();
		});

		pubsub.subscribe('game/render', function (message, data) {
			that.writeScore(data);
			that.writeTeamNames(data);
			that.writeCountdown(data);
		});

		pubsub.subscribe('game/score', function () {
			that.renderGoalText();
		});
	}

	TextCanvas.prototype = new Canvas(document.getElementById('text'));
	TextCanvas.prototype.constructor = TextCanvas;

	TextCanvas.prototype.renderGoalText = function () {

		this.context.font = '40px' + this.font;
		this.context.shadowBlur = null;
		this.context.fillStyle = '#FFE64D';
		this.context.fillText('Goal!', (this.canvasWidth / 2) - 55, this.canvasHeight - 15);
	};

	TextCanvas.prototype.writeScore = function (data) {
		var game = data.gameData,
			move = data.moveCount,
			gameMove = game.gameSequence[move];

		this.saveCanvasState();
		this.clearCanvas();

		this.context.font = '35px' + this.font;
		this.context.shadowBlur = null;
		this.context.fillStyle = this.primary0Colour;
		this.context.fillText(gameMove.score.split(':')[0], (this.canvasWidth / 2) - 80, this.pitchStartingY - 10);
		this.context.fillStyle = this.primary1Colour;
		this.context.fillText(gameMove.score.split(':')[1], (this.canvasWidth / 2) + 50, this.pitchStartingY - 10);

		this.restoreCanvasState();
	};

	TextCanvas.prototype.writeTeamNames = function (data) {
		var game = data.gameData;

		this.saveCanvasState();

		this.context.font = '20px' + this.font;
		this.context.shadowBlur = null;
		this.context.fillStyle = '#ffe64d';
		this.context.textAlign = 'center';
		this.context.fillText(game.teamNames.split(',')[0] + '  vs.  ' + game.teamNames.split(',')[1], (this.canvasWidth / 2), 20);

		this.restoreCanvasState();
	};

	TextCanvas.prototype.renderEndGameText = function () {
		this.context.font = '40px' + this.font;
		this.context.shadowBlur = null;
		this.context.fillStyle = '#FFE64D';
		this.context.fillText('Game Over', (this.canvasWidth / 2) - 100, (this.canvasHeight / 2) - 15);
	};

	TextCanvas.prototype.writeCountdown = function (data) {
		var gameLength = (data.gameData.gameSequence.length - 1),
			moveCount = data.moveCount,
			countdown = gameLength - moveCount;

		this.context.font = '16px' + this.font;
		this.context.shadowBlur = null;
		this.context.fillStyle = '#FFE64D';
		this.context.fillText('CPU cycles: ' + countdown, (this.canvasWidth - this.pitchStartingX) - 160, this.pitchStartingY - 10);
	};

	return TextCanvas;
});