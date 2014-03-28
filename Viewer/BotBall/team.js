/**
	Dependencies
*/


var Team = function () {
	'use strict';
	this.positions = [];
	this.opposition = [];
};

/**
	Updates the position of the team
	@param index {number} index of array to splice
	@param position {array} new position of player
*/
Team.prototype.updatePositions = function (index, position) {
	'use strict';

	this.positions.splice(index, 1, position);
};

/**
	Concatenate's all the players positions together
*/
Team.prototype.mergeEachTeamsPositions = function () {
	'use strict';

	return this.positions.concat(this.oppositionPositions);
};

exports.Team = Team;