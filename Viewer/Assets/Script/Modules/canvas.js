/*global define */

define(['Utilities/pubsub'], function () {
	'use strict';

	function Canvas (element, options) {

		if (!element) {
			console.log('there is no spoon...');
			return;
		}

		options = options || {};

		this.context = element.getContext('2d');
		this.scale = options.scale || 20;
		this.canvasWidth = options.canvasWidth || element.width;
		this.canvasHeight = options.canvasHeight || element.height;
		this.pitchWidth = this.canvasWidth * 0.75;
		this.pitchHeight = this.canvasHeight * 0.75;
		this.pitchStartingX = (this.canvasWidth - this.pitchWidth) / 2;
		this.pitchStartingY = (this.canvasHeight - this.pitchHeight) / 2;
		this.lineWidth = options.lineWidth || 4;
		this.primary0Colour = options.primary0Colour || '#6FC3DF';
		this.secondary0Colour = options.secondary0Colour || '#E6FFFF';
		this.primary1Colour = options.primary1Colour || '#DF740C';
		this.secondary1Colour = options.secondary1Colour || '#FFE64D';
		this.font = '"Orbitron",Tahoma,Geneva,Verdana,sans-serif';

		this.context.shadowBlur = options.shadowBlur || 10;
	}

	/**
		Saves current canvas state
	*/
	Canvas.prototype.saveCanvasState = function() {
		this.context.save();
	};

	/**
		Clears the canvas
		@param, width, optional, the width of the area to clear
		@param, height, options, the height of the area to clear
	*/

	Canvas.prototype.clearCanvas = function (width, height) {
		var clearWidth = width || this.canvasWidth,
			clearHeight = height || this.canvasHeight;

		this.context.clearRect(0, 0, clearWidth, clearHeight);
	};

	/**
		Restores the canvas from the last save
	*/
	Canvas.prototype.restoreCanvasState = function () {
		this.context.restore();
	};

	return Canvas;

});

