/*global define, pubsub */
define(['Utilities/pubsub'], function () {
	'use strict';

	function AudioPlayer () {
		var that = this;

		/**
			Subscriptions
		*/
		pubsub.subscribe('game/kick', function (message, element) {
			that.playAudio(element);
		});

		pubsub.subscribe('game/end', function () {
			that.playAudio(document.querySelectorAll('.endSound')[0]);
		});

		pubsub.subscribe('game/score', function (){
			that.playAudio(document.querySelectorAll('.goal')[0]);
		});
	}

	/**
		Plays an HTML5 audio element
		@param, element, required, the HTML5 audio element to play
	*/
	AudioPlayer.prototype.playAudio = function (element) {
		if(!element) {
			console.log('Audio player received no element');
		}

		element.play();
	};

	return AudioPlayer;
});
