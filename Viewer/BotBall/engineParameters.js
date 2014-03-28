/**
	Set up for the board parameters
*/

var GameParameters = {
	"dimensions": {
		"width": 30,
		"height": 20
	},
	"directions": [
		"N",
		"NE",
		"E",
		"SE",
		"S",
		"SW",
		"W",
		"NW",
		""
	],
	"legalMoves": [
		"move", "kick"
	],
	"ballStart": "15,10",
	"startScore": "0:0",
	"kickStrength": 5,
	"gameFilePath": "../Website/Games/"
};


// exports the bot ball processor so it can be accessed elsewhere
exports.EngineParameters = GameParameters;