/**
	Model dependencies
*/

var EngineValidator = require('../BotBall/botBallValidator').EngineValidator,
	EngineProcessor = require('../BotBall/botBallProcessor').EngineProcessor,
	FileWriter = require('../BotBall/fileWriter').FileWriter;

var engineValidator = new EngineValidator(),
	engineProcessor = new EngineProcessor(),
	fileWriter = new FileWriter();

/**
	Model provider
	Responsible for:
	Communicating with the controller
	Processing the commands from the Bots
	Outputting the new positions
*/

var ModelProvider = function () {
	'use strict';
};

/**
	Interface for validating JSON data
*/

ModelProvider.prototype.validate = function (options, callback) {
	'use strict';
	var that = this;

	engineValidator.receiveData(options.moves, function (error, errorMessages) {
		if (error === true) {
			console.log(errorMessages);
		} else {
			that.process(options, function (nextGameState) {

				fileWriter.writeToGameFile(options.fileName, nextGameState);

				callback(nextGameState);
			});
		}
	});
};

/**
	Interface for processing JSON data, once validated
*/

ModelProvider.prototype.process = function (options, callback) {
	'use strict';

	engineProcessor.processMoves(options, function (nextGameState) {
		callback(nextGameState);
	});
};

/**
	Initialises the model
*/

ModelProvider.prototype.initializeGame = function (options, callback) {
	'use strict';

	engineProcessor.createNewGameState(options.playerNumber, function (gameModel) {

		fileWriter.createGameFile(options.fileName, options.teamNames, gameModel);
		callback(gameModel);
	});
};

ModelProvider.prototype.finishGameFile = function (fileName, gameInformation) {
	'use strict';
	fileWriter.finishGameFile(fileName, gameInformation);
};


// exports the Model provider so it can be accessed elsewhere
exports.ModelProvider = ModelProvider;