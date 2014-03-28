/**
	Dependencies
*/
var fs = require('fs');
var EngineParameters = require('../BotBall/engineParameters').EngineParameters;


var FileWriter = function () {
	'use strict';
};



/**
	Create game file
*/
FileWriter.prototype.createGameFile = function (fileName, teamNames, gameInformation) {
	'use strict';
	var path = EngineParameters.gameFilePath,
		file = path + fileName;

	fs.writeFileSync(file, 'var gameData = { "teamNames": "' +
		teamNames +
		'", "gameSequence": [ ' +
		JSON.stringify(gameInformation) +
		'\n');
};


/**
	Append new information to game file
*/
FileWriter.prototype.writeToGameFile = function (fileName, gameInformation) {
	'use strict';
	var path = EngineParameters.gameFilePath,
		file = path + fileName;

	fs.appendFileSync(file, ',' + JSON.stringify(gameInformation) + '\n');
};


/**
	Finshes the output of game file
*/
FileWriter.prototype.finishGameFile = function(fileName, gameInformation) {
	'use strict';

	var path = EngineParameters.gameFilePath,
		file = path + fileName;

	fs.appendFileSync(file, gameInformation);
};

exports.FileWriter = FileWriter;