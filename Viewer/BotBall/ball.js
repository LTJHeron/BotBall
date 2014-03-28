/**
	Dependencies
*/
var EngineParameters = require('../BotBall/engineParameters').EngineParameters;
var Utilities = require('../BotBall/utilities').Utilities;

var utilities = new Utilities();

var Ball = function () {
	'use strict';
	this.position = utilities.convertStringToArray(EngineParameters.ballStart);
	this.x = this.position[0];
	this.y = this.position[1];
};

/**
	Transports the ball to a random location on the pitch
*/
Ball.prototype.transportBall = function (callback) {
	'use strict';

	var newPosition = [];

	var from = Math.floor(EngineParameters.dimensions.width / 3),
		to = Math.floor(EngineParameters.dimensions.width - (EngineParameters.dimensions.width / 3));

	var newX = Math.floor(Math.random() * (to - from + 1) + from) + 1,
		newY = Math.floor(Math.random() * EngineParameters.dimensions.height) + 1;

	newPosition.push(newX);
	newPosition.push(newY);

	callback(newPosition);
};

/**
	Checks whether player is adjacent to the ball
*/
Ball.prototype.ballAdjacentPlayer = function (ball, player, callback) {
	'use strict';

	if (Math.sqrt(Math.pow((ball.x - player.x), 2) + Math.pow((ball.y - player.y), 2)) <= Math.sqrt(2)) {
		callback(true);
	} else {
		callback(false);
	}
};

/**
	Reverses ball direction after a bounce
*/
Ball.prototype.reverseBallDirection = function (direction, callback) {
	'use strict';

	switch(direction){
	case 'N':
		direction = 'S';
		break;
	case 'NW':
		direction = 'SW';
		break;
	case 'NE':
		direction = 'SE';
		break;
	case 'S':
		direction = 'N';
		break;
	case 'SW':
		direction = 'NW';
		break;
	case 'SE':
		direction = 'NE';
		break;
	case 'E':
		direction = 'E';
		break;
	case 'W':
		direction = 'W';
		break;
	default:
		console.log('Player command', direction);
		throw new Error('Something went wrong when trying to reverse ball direction');
	}

	callback(direction);
};

/**
	Updates ball positions
*/
Ball.prototype.updateBallPosition = function (position) {
	if(utilities.isArray(position) && position.length === 2) {
		this.position = position;
		this.x = position[0];
		this.y = position[1];
	} else {
		throw new Error('Update Ball Position', 'Position is not an array with length two');
	}
};

exports.Ball = Ball;