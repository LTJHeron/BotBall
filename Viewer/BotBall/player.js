/**
	Dependencies
*/
var Calculator = require('../BotBall/calculator').Calculator;

var calculator = new Calculator();


var Player = function (position, move, key, index) {
	'use strict';
	/*this.newMove = '' ;*/
	this.currentMove = position;
	this.command = move[key];
	this.index = index;
	this.x = position[0];
	this.y = position[1];
};

/**
	Creates a new coordinate set for the player
*/
Player.prototype.movePlayer = function (callback) {
	'use strict';

	var newPosition = [];

	newPosition[0] = calculator.getNewX(this.x, this.command),
	newPosition[1] = calculator.getNewY(this.y, this.command);

	newPosition[0] = calculator.validatePositionAgainstPitchWidth(newPosition[0]);
	newPosition[1] = calculator.validatePositionAgainstPitchHeight(newPosition[1]);

	callback(newPosition);
};

/**
	Update player positions
*/
Player.prototype.updatePosition = function (newPosition) {
	'use strict';
	this.currentMove = newPosition;
	this.x = newPosition[0];
	this.y = newPosition[1];
};


exports.Player = Player;