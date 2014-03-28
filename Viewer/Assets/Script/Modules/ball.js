/*global define, pubsub */

define(['Utilities/pubsub', 'Modules/canvas'], function () {
	'use strict';

	var args = Array.prototype.slice.call(arguments),
		Canvas = args[1];

	/**
		Subclass of Canvas, controls the rendering of the ball
	*/
	function Ball () {

		var that = this;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/render', function (message, data) {
			that.drawBall(data);
		});
	}

	Ball.prototype = new Canvas(document.getElementById('ball'));
	Ball.prototype.constructor = Ball;

	/**
		Renders the ball in a new location
		@param, newX, required, the new x coordinate
		@param, newY, required, the new y coordinate
	*/
	Ball.prototype.moveBall = function (newX, newY) {

		this.saveCanvasState();
		this.clearCanvas(this.canvasWidth, this.canvasHeight);

		this.context.beginPath();
		this.context.fillStyle = 'yellow';
		this.context.shadowColor = 'yellow';
		this.context.arc(newX + 10, newY + 10, 8, 0, Math.PI * 2, true); // Jim added 10
		this.context.closePath();
		this.context.fill();

		this.restoreCanvasState();
	};

	/**
		Controls the logic for rendering the ball
	*/
	Ball.prototype.drawBall = function(data) {

		var game = data.gameData,
			move = data.moveCount,
			oldGameMove = game.gameSequence[move === 0 ? 0 : move-1],
			currentGameMove = game.gameSequence[move],
			startX = ((oldGameMove.ball.split(',')[0]) * this.scale) + this.pitchStartingX,
			// flips the coordinates
			startY = this.canvasHeight - ((oldGameMove.ball.split(',')[1] * this.scale) + this.pitchStartingY),
			endX = ((currentGameMove.ball.split(',')[0]) * this.scale) + this.pitchStartingX,
			// flips the coordinates
			endY = this.canvasHeight - ((currentGameMove.ball.split(',')[1] * this.scale) + this.pitchStartingY),
			amount = 0,
			that = this;

		// a goal was scored
		if (startX > (this.canvasWidth - this.pitchStartingX) || startX < this.pitchStartingX) {
			//drawGoal(positions);
			pubsub.publish('game/score', endX);
			return;
		}

		if (startX !== endX || startY !== endY) {
			pubsub.publish('game/kick', document.querySelectorAll('.kick')[0]);

			var animateBall = setInterval(function() {
				amount += 0.10; // change to alter duration
				if (amount >= 1) {
					clearInterval(animateBall);
				}

				// t: current time, b: begInnIng value, c: change In value, d: duration
				/*easeOutExpo: function (x, t, b, c, d) {
					return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
				}*/

				// lerp : a  + (b - a) * f

				if (data.forward === true){
					that.moveBall(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
				} else {
					that.moveBall(endX + (startX - endX) * amount, endY + (startY - endY) * amount);
				}

			}, 10);
		} else {
			this.moveBall(startX, startY);
		}


	};

	return Ball;

});