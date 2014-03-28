/**
	Dependencies
*/
var EngineParameters = require('../BotBall/engineParameters').EngineParameters;
var Utilities = require('../BotBall/utilities').Utilities;

var utilities = new Utilities();

var GameState = function (currentPlayer) {
	'use strict';

	this.startCoordinate = 0;
	this.endCoordinate = EngineParameters.dimensions.width;
	this.yourBot = currentPlayer;
	this.player0 = [
		this.startCoordinate + ',0',
		this.startCoordinate + ',5',
		this.startCoordinate + ',10',
		this.startCoordinate + ',15',
		this.startCoordinate + ',20'
	];
	this.player1 = [
		this.endCoordinate + ',0',
		this.endCoordinate + ',5',
		this.endCoordinate + ',10',
		this.endCoordinate + ',15',
		this.endCoordinate + ',20'
	];
	this.ball = EngineParameters.ballStart;
	this.score = EngineParameters.startScore;
};

/**
	Returns the game state json object
*/
GameState.prototype.createGameStateJson = function (callback) {
	'use strict';

	callback({
		'yourBot': this.yourBot,
		'player0': this.player0,
		'player1': this.player1,
		'ball': this.ball,
		'score': this.score
	});
};


/**
	Updates the value of the global game model object
*/
GameState.prototype.updateGameState = function (currentPlayer, newMoves) {
	'use strict';

	var movesArray = [], i, newMove = '';

	this.yourBot = currentPlayer === 0 ? 1 : 0;

	for (i = 0; i < newMoves.length; i++) {
		newMove = utilities.convertArrayToString(newMoves[i]);
		movesArray.push(newMove);
	}

	if (currentPlayer === 0) {
		this.player0 = movesArray;
	} else {
		this.player1 = movesArray;
	}
};


exports.GameState = GameState;
