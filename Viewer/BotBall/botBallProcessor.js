/**
	Dependencies
*/
var EngineParameters = require('../BotBall/engineParameters').EngineParameters,
	Ball = require('../BotBall/ball').Ball,
	Player = require('../BotBall/player').Player,
	Team = require('../BotBall/team').Team,
	GameState = require('../BotBall/gameState').GameState,
	FileWriter = require('../BotBall/fileWriter').FileWriter,
	Utilities = require('../BotBall/utilities').Utilities;

var Calculator = require('../BotBall/calculator').Calculator;

var fileWriter = new FileWriter();
var utilities = new Utilities();

var player, team, ball = new Ball(), gameState, calculator = new Calculator();

/**
	BotBall JSON processor
*/

var BotBallProcessor = function () {
	'use strict';

	var that = this;

	this.playerScored = false;
	//this.goalScored = false;
	this.currentPlayer = 0;
	// the positions of all players
	this.allPositions = [];
	this.nextPlayer = 1;
	this.fileName = null;
	this.gameStateCallback = function () {};

	this.goalCheckCallback = function (ballPosition, score) {
		if (that.playerScored === true) {
			// first write out the ball position beyond the goal line for the visualiser
			// and update the score
			gameState.ball = utilities.convertArrayToString(ballPosition);
			gameState.score = score;

			gameState.createGameStateJson(function (model) {
				fileWriter.writeToGameFile(that.fileName, model, false);
			});

			// then transport the ball somewhere randomly
			ball.transportBall(function (newBallPosition) {
				ball.updateBallPosition(newBallPosition);
				gameState.ball = utilities.convertArrayToString(newBallPosition);
				gameState.createGameStateJson(function (model) {
					fileWriter.writeToGameFile(that.fileName, model, false);
				});
			});

			that.playerScored = false;

		} else {
			//console.log('ball position: ' + ballPosition);
			ball.updateBallPosition(ballPosition);
		}

		// update the all positions property
		that.allPositions = team.mergeEachTeamsPositions();
	};
};

BotBallProcessor.prototype.collisionDetection = function (coordinates, oldPosition, exception, callback) {
	'use strict';

	var i = 0;

	for (i; i < this.allPositions.length; i++) {

		if (this.allPositions[i][0] === coordinates[0] && this.allPositions[i][1] === coordinates[1] && i !== exception) {
			// reverts to old moves
			callback(oldPosition, true);
			return;
		}
		if (i === (this.allPositions.length - 1)) {
			callback(coordinates, false);
		}
	}
};

BotBallProcessor.prototype.processMoves = function (options, callback) {
	'use strict';
	team = new Team();

	var that = this;

	if (options.playerNo === 0) {
		team.positions = calculator.createPositions(gameState.player0);
		team.oppositionPositions = calculator.createPositions(gameState.player1);
	} else {
		team.positions = calculator.createPositions(gameState.player1);
		team.oppositionPositions = calculator.createPositions(gameState.player0);
	}

	this.currentPlayer = options.playerNo;
	this.nextPlayer = options.playerNo === 0 ? 1 : 0;
	this.gameStateCallback = callback;
	this.fileName = options.fileName;
	this.allPositions = team.mergeEachTeamsPositions();

	options.moves.commands.forEach(function (move, i){

		var key = Object.keys(move);

		// create new player
		player = new Player(team.positions[i], move, key, i);

		var command = that[key];
		if (!command) {
			throw new Error('Invalid command ' + key);
		}
		command.call(that, i);

		if (i === 4) {
			that.sendBackGameState();
		}
	});
};


/**
	Sends back the game state to the controller
*/
BotBallProcessor.prototype.sendBackGameState = function () {
	'use strict';
	var that = this;

	gameState.ball = utilities.convertArrayToString(ball.position);
	gameState.updateGameState(that.currentPlayer, team.positions);
	gameState.createGameStateJson(function (model) {
		//console.log(model);
		that.gameStateCallback(model);
	});
};

/**
	Move command
*/

BotBallProcessor.prototype.move = function () {
	'use strict';

	var that = this;

	player.movePlayer(function (newPosition) {
		that.collisionDetection(newPosition, player.currentMove, null, function (finalPosition) {
			// splice the value into the correct position in the array
			team.updatePositions(player.index, finalPosition);
			// update the position of the player
			player.updatePosition(finalPosition);

			that.processBall(that.goalCheckCallback);
		});

	});
};

/**
	Dribble the ball
*/
BotBallProcessor.prototype.processBall = function (callback) {
	'use strict';

	var	newBallPosition = [];

	// checks to see whether the player is now ontop of the ball
	if(Math.sqrt(Math.pow((ball.x - player.x), 2) + Math.pow((ball.y - player.y), 2)) === 0) {
	//	console.log('Player ontop of ball');
		newBallPosition[0] = calculator.getNewX(ball.x, player.command);
		newBallPosition[1] = calculator.getNewY(ball.y, player.command);

		this.checkBallPosition(newBallPosition, function (newCoordinates, score) {
			callback(newCoordinates, score);
		});

	} else {
		// basically do nothing and return the original coordinates
		newBallPosition = [ball.x,ball.y];
		callback(newBallPosition, null);
	}
};


/**
	Checks the ball position to see if
	a goal has been scored or if it needs to
	bounce off the sides
	@callback {function} goalCheckCallback
*/
BotBallProcessor.prototype.checkBallPosition = function (coordinates, callback) {
	'use strict';

	var that = this,
		score;

	var options = {
		'xBoundary': EngineParameters.dimensions.width,
		'yBoundary': EngineParameters.dimensions.height
	},
	newBallPosition;

	// check for goal
	if (coordinates[0] > options.xBoundary || coordinates[0] < 0) {
		this.updateScore(coordinates[0], function (score){
			that.playerScored = true;
			score = score;
			callback(coordinates, score);
		});

	} else if (coordinates[1] >= options.yBoundary || coordinates[1] <= 0) {
		// bounce ball
		if (coordinates[1] > options.yBoundary) {
			// beyond the top edge
			newBallPosition = [coordinates[0],options.yBoundary];
		} else if (coordinates[1] < 0) {
			// beyond the bottom edge
			newBallPosition = [coordinates[0],0];
		} else if (coordinates[1] === options.yBoundary || coordinates[1] === 0) {
			// on the line
			gameState.ball = utilities.convertArrayToString(coordinates);
			gameState.updateGameState(this.currentPlayer, team.positions);
			gameState.createGameStateJson(function (model) {
				fileWriter.writeToGameFile(that.fileName, model, false);
			});
			newBallPosition = [coordinates[0],coordinates[1]];
		}

		ball.reverseBallDirection(player.command, function (newDirection){
			player.command = newDirection;
		});

		callback(newBallPosition, score);

	} else {
		newBallPosition = [coordinates[0],coordinates[1]];
		callback(newBallPosition, score);
	}

};

/**
	Kick command
*/
BotBallProcessor.prototype.kick = function () {
	'use strict';

	var that = this;

	ball.ballAdjacentPlayer(ball, player, function (adjacent) {
		if (adjacent) {
			that.kickBall();
		}
	});
};

/**
	Moves the player on the ball square before kicking
*/
BotBallProcessor.prototype.movePlayerOnBallPosition = function (callback) {
	'use strict';

	var newPosition = [ball.x + ',' + ball.y];

	callback(newPosition);
};

/**
	Kick the ball
*/
BotBallProcessor.prototype.kickBall = function () {
	'use strict';

	var newBallPosition = [0,0],
		i = 0,
		that = this,
		checkBallPosition = function (position, collision){
			// there has been not been a collision on the first kick
			// move the player ontop of the ball
			if (!collision && i === 0) {
				that.movePlayerOnBallPosition(function (position) {
					// splice the value into the correct position in the array
					team.updatePositions(player.index, position);
				});
			}

			that.checkBallPosition(position, that.goalCheckCallback);
		};

	// rather than move the ball 5 spaces at once, move it one step 5 times
	// that way we'll be able to collision detect it!
	for (i; i < EngineParameters.kickStrength; i++) {

		newBallPosition[0] = calculator.getNewX(ball.x, player.command);
		newBallPosition[1] = calculator.getNewY(ball.y, player.command);

		this.collisionDetection(newBallPosition, ball.position, player.index, checkBallPosition);
	}

};

/**
	Goal! Update the score
*/
BotBallProcessor.prototype.updateScore = function (xposition, callback) {
	'use strict';

	var score = gameState.score.split(':'),
		player0 = parseInt(score[0].trim(), 10),
		player1 = parseInt(score[1].trim(), 10),
		newScore;

	newScore = xposition < 0 ? player0 + ':' + (player1 + 1) : (player0 + 1) + ':' + player1;

	callback(newScore);
};

/**
	Creates a new game state and passes it back to the model provider
*/
BotBallProcessor.prototype.createNewGameState = function (player, callback) {
	'use strict';

	gameState = new GameState(player);

	gameState.createGameStateJson(function (model){
		callback(model);
	});
};



// exports the bot ball processor so it can be accessed elsewhere
exports.EngineProcessor = BotBallProcessor;