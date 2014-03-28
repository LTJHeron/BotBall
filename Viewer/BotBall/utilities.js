
/**
	Utility object for some useful methods
*/
function Utilities () {
	'use strict';
}

/**
	Converts an array to string
	@param array {Array} the array to convert
*/
Utilities.prototype.convertArrayToString = function (array) {
	'use strict';
	var string = '', i;
	// check that array is being passed through
	if(this.isArray(array) && array.length > 0) {
		for (i = 0; i < array.length; i++) {
			string += i === array.length - 1 ? array[i] : array[i] + ',';
		}
		return string;
	} else {
		console.log('Convert array to string', array);
		throw new Error('Convert Array to String - Parameter must be an array that is not empty');
	}
};

/**
	Converts a string to array
	Assumes that the string is a coordinate, e.g. 10,15
	Will split the coordinate on the ,
	@param string {String} the coordinate to convert into an array
*/
Utilities.prototype.convertStringToArray = function(string) {
	'use strict';
	var array = [], i, splitString;

	if(this.isString(string)){
		splitString = string.split(',');

		for(i = 0; i < 2; i++) {
			array[i] = parseInt(splitString[i], 10);
		}
		return array;
	} else {
		console.log('Convert string to array', string);
		throw new Error('Convert string to array - Parameter must be a string');
	}

};


/**
	Checks that element is array
	@param array {Array} the data to check
*/
Utilities.prototype.isArray = function (array) {
	'use strict';
	return !!array && array.constructor === Array;
};

/**
	Checks if element is string
	Assumes you're not being silly and creating strings
	through new String()
	@param string {String} the variable to be checked
*/
Utilities.prototype.isString = function (string) {
	'use strict';
	return typeof string === 'string';
};

exports.Utilities = Utilities;