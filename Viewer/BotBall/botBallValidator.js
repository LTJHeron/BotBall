/**
	BotBall Validator dependencies
*/

var async = require('async'),
	EngineParameters = require('../BotBall/engineParameters').EngineParameters;


/**
	BotBall validator
*/

var BotBallValidation = function () {};

/**
	Receives JSON data from the game engine interface
*/
BotBallValidation.prototype.receiveData = function (moves, callback) {
	this.validate(moves, function (isValid, errors){
		callback(isValid, errors);
	});
};


/**
	Coordinates the different validations and passes through
	an amalagated validation object
*/

BotBallValidation.prototype.validate = function (moves, callback) {
	async.parallel({
		correctPlayerNumber : function (callback) {
			BotBallValidation.prototype.correctPlayerNumber(moves, function (error, messages) {
				callback(error, messages);
			});
		},
		legalDirections: function (callback) {
			BotBallValidation.prototype.legalDirections(moves, function (error, messages) {
				callback(error, messages);
			});
		}
	}, function (error, messages) {
		if (error) {
			callback(true, messages);
		} else {
			callback(false);
		}
	});
};

/**
	Checks that all five players have been given moves for
	that turn
*/

BotBallValidation.prototype.correctPlayerNumber = function (data, callback) {
	var errorMessage = "You have only given moves for " + data.length +
						" players. Moves for all 5 players are needed.";

	if (data.commands.length !== 5) {
		callback(true, errorMessage);
	} else {
		callback(false, null);
	}
};

/**
	Checks that movements are legal
*/

BotBallValidation.prototype.legalDirections = function (data, callback) {
	var i, j;

	for (i = 0; i < data.commands.length; i = i + 1) {
		var direction = data.commands[i].move || data.commands[i].kick;

		if (direction !== undefined) {
			if (EngineParameters.directions.indexOf(direction) === -1) {
				callback(true, direction + " is not a valid direction of movement!");
				return;
			}
		}

	}

	callback(false, null);
};


// exports the bot ball validator so it can be accessed elsewhere
exports.EngineValidator = BotBallValidation;