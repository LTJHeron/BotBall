var gameController = require('./Controller/liteGameController');


// Model object that is returned by the model provider
/**
Either 1 or 0
Corresponds to which set of coordinates in the
Bot Coodinate Sets. 0 = first and 1 = second
*/
var returnedModel = {
    "yourBot": 1,
    "player0": [
			'1,2',
			'5,7',
			'6,2',
			'4,4',
			'10,4'
		],
    "player1": [
			'30,0',
			'22,14',
			'26,3',
			'28,14',
			'16,4'
		],
    "ball": '15,10',
    "score": '0:0'
};

/**
Global GameModel object that is used to store
the game state in memory
*/

global.GameModel = null;

console.error("BotBallLite start : " + process.argv[2] + ", " + process.argv[3] + ", " + process.argv[4] + ", " + process.argv[5]);
// Start the game controller
gameController.start(process.argv[2], process.argv[3], process.argv[4], process.argv[5], false);