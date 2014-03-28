/**
	Dependencies
*/
var EngineParameters = require('../BotBall/engineParameters').EngineParameters;

var Calculator = function () {
	'use strict';
};

/**
	Processes and returns new x coordinate
*/
Calculator.prototype.getNewX = function (x, direction) {
	'use strict';

	var newX;

	switch (direction) {
	case 'N':
	case 'S':
		newX = x;
		break;
	case 'W':
	case 'NW':
	case 'SW':
		newX = x - 1;
		break;
	case 'E':
	case 'NE':
	case 'SE':
		newX = x + 1;
		break;
	default:
		newX = x;
	}

	return newX;
};


Calculator.prototype.getNewY = function (y, direction) {
	'use strict';

	var newY;

	switch (direction) {
	case 'W':
	case 'E':
		newY = y;
		break;
	case 'NW':
	case 'N':
	case 'NE':
		newY = y + 1;
		break;
	case 'SW':
	case 'S':
	case 'SE':
		newY = y - 1;
		break;
	default:
		newY = y;
	}

	return newY;
};

/**
	Validate width dimensions
*/
Calculator.prototype.validatePositionAgainstPitchWidth = function (coordinate) {
	'use strict';

	if (coordinate > EngineParameters.dimensions.width) {
		coordinate = EngineParameters.dimensions.width;
	} else if (coordinate < 0) {
		coordinate = 0;
	}

	return coordinate;
};

/**
	Validate height dimensions
*/
Calculator.prototype.validatePositionAgainstPitchHeight = function (coordinate) {
	'use strict';

	if (coordinate > EngineParameters.dimensions.height) {
		coordinate = EngineParameters.dimensions.height;
	} else if (coordinate < 0) {
		coordinate = 0;
	}

	return coordinate;
};


/**
	Converts the given string of team positions into a
	multidimensional array so that the x and y coordinate
	can be easily accessed It also converts the strings into
	numbers
*/
Calculator.prototype.createPositions = function(positions) {
	'use strict';

	var positionArray = [],
		i = 0,
		x, y;

	//console.log(positions);

	for(i; i < positions.length; i++) {
		x = parseInt(positions[i].split(',')[0], 10);
		y = parseInt(positions[i].split(',')[1], 10);
		positionArray.push([x,y]);
	}

	return positionArray;
};


exports.Calculator = Calculator;