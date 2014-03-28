/*global define, pubsub */

define(['Utilities/pubsub', 'Modules/canvas'], function () {
	'use strict';

	var args = Array.prototype.slice.call(arguments),
		Canvas = args[1];

	/**
		Subclass of Canvas
		Controls the rendering of the pitch
	*/
	function Pitch () {
		var that = this;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/render', function (){
			that.clearCanvas(that.canvasWidth, that.canvasHeight);
			that.drawGridLines();
			that.drawGoalAreas(that.primary1Colour, that.canvasWidth - that.pitchStartingX + 20, that.canvasWidth);
			that.drawGoalAreas(that.primary0Colour, 20, that.pitchStartingX);
			that.drawPitch();
		});

		pubsub.subscribe('game/score', function (message, ballX){
			if (ballX < that.pitchStartingX) {
				that.drawGoalAreas(that.secondary0Colour, 0, that.pitchStartingX);
			} else {
				console.log('drawPitch');
				that.drawGoalAreas(that.secondary1Colour, that.canvasWidth - that.pitchStartingX, that.canvasWidth);
			}
		});
	}

	Pitch.prototype = new Canvas(document.getElementById('pitch'));
	Pitch.prototype.constructor = Pitch;

	Pitch.prototype.drawGridLines = function () {
		var i = 0, j = 0;

		this.context.strokeStyle = 'rgba(230,255,255,0.2)';

		for (i; i < this.canvasWidth / this.scale; i = i + 1) {
			this.saveCanvasState();
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.shadowBlur = null;
			this.context.moveTo(i * this.scale, 0);
			this.context.lineTo(i * this.scale, this.canvasHeight);
			this.context.stroke();
			this.restoreCanvasState();
		}

		for (j; j < this.canvasHeight / this.scale; j = j + 1) {
			this.saveCanvasState();
			//this.context.strokeStyle = 'rgba(230,255,255,0.3)';
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.shadowBlur = null;
			this.context.moveTo(0, j * this.scale);
			this.context.lineTo(this.canvasWidth, j * this.scale);
			this.context.stroke();
			this.restoreCanvasState();
		}
	};

	Pitch.prototype.drawPitch = function () {
		var endX = this.canvasWidth - (this.pitchStartingX * 2) + 20,
			endY = this.canvasHeight - (this.pitchStartingY * 2) + 10;

		this.context.strokeStyle = '#FFF';
		this.context.shadowColor = this.primary0Colour;
		this.context.lineWidth = this.lineWidth;

		this.context.strokeRect(this.pitchStartingX, this.pitchStartingY + 10, endX, endY);
	};

	Pitch.prototype.drawGoalAreas = function (colour, startingX, endingX) {
		var steps = 20;

		for (var i = 0; i < steps; i = i + 1) {
			//this.saveCanvasState();
			this.context.strokeStyle = colour;
			this.context.shadowColor = colour;
			this.context.beginPath();
			this.context.moveTo(startingX, 0 + i * (this.canvasHeight / steps));
			this.context.lineTo(endingX, this.pitchStartingY + (i - 1) * (this.canvasHeight / steps));
			this.context.stroke();
			//this.restoreCanvasState();
		}
	};

	return Pitch;
});