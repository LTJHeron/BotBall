var sys = require('sys');
var timers = require("timers");
var spawn = require('child_process').spawn;
var util = require("util");
var timers = require("timers");
var MongoClient = require('mongodb').MongoClient;

var ModelProvider = require('../Model/modelProvider').ModelProvider,
    EngineParameters = require('../BotBall/engineParameters').EngineParameters,
    modelProvider = new ModelProvider();

var botPlayer0;
var botPlayer1;

var version = "$Rev: 723 $";

// Version $Revision: 723 $
//TO DO : Deal with JSON only
//TO DO : Timing of moves
//TO DO : Timing of games
//TO Do : Handshake code
//TO DO : Log game states to file
//TO DO : End game routine
//TO DO : Queing/scheduling of games

function start(bot0Exe, bot0Name, bot1Exe, bot1Name, useRatings) {

    var teamNames = [2];
    var gameContoller;
    var playerTurn;
    var playerTimeout;
    var movesPerGame;
    var viewerFilename;
    var timePerMove = 25000; // number of millesecond each player has to move

    function runbots(bot0Name,bot0Exe, bot1Name, bot1Exe ) {

        var arguments = bot0Exe.split(" ");
        if (arguments.length === 1) {
            console.log('Easy Start : ' + bot0Exe);
            botPlayer0 = spawn(bot0Exe);
        } else {
            var exeName = arguments[0];
            arguments.splice(0, 1);
            console.log('Complex Start : ' + exeName + " : " + arguments);
            botPlayer0 = spawn(exeName, arguments);
        }

        teamNames[0] = bot0Name;


        botPlayer0.stdout.on('data', function (data) {
            console.log("Data from bot 0 (write to server) : " + data.toString());
            sendData(0,data.toString());
        });

        botPlayer0.stderr.on('data', function (data) {
            console.log("Error Channel Data from bot0 (stderr) : " + data.toString());
        });

        var arguments2 = bot1Exe.split(" ");
        if (arguments2.length === 1) {
            console.log('Easy Start : ' + bot1Exe);
            botPlayer1 = spawn(bot1Exe);
        } else {
            var exeName2 = arguments2[0];
            arguments2.splice(0, 1);
            console.log('Complex Start : ' + exeName2 + " : " + arguments2);
            botPlayer1 = spawn(exeName2, arguments2);
        }

        teamNames[1] = bot1Name;

        botPlayer1.stdout.on('data', function (data) {
            console.log("Data from bot 1 (write to server) : " + data.toString());
            sendData(1,data.toString());
        });

        botPlayer1.stderr.on('data', function (data) {
            console.log("Error Channel Data from bot1 (stderr) : " + data.toString());
        });
    }

    function sendData(player, buffer) {

        if (player === playerTurn) { // only allow play if its the right players turn

            if (isJsonComplete(buffer)) {
                timers.clearTimeout(playerTimeout);
                console.log("Player " + teamNames[player] + " move : " + buffer);

               var options = {
                    playerNo: playerTurn,
                    moves: JSON.parse(buffer),
                    fileName: viewerFilename
                };

                modelProvider.validate(options, function (currentGameState) {

                    var currentGameStateString = JSON.stringify(currentGameState);

                    buffer = '';
                    movesPerGame--;
                    if (movesPerGame < 1) {
                        // extract the score and determine the winner from currentGameStateString
                        var score = currentGameState.score.split(":");

                        console.log("FINAL SCORE : " + teamNames[0] + " " + score[0] + " v " + score[1] + " " + teamNames[1]);

                        var winner = -1;

                        if (parseInt(score[0], 10) > parseInt(score[1], 10)) {
                            winner = 0;
                        }
                        if (parseInt(score[1], 10) > parseInt(score[0], 10)) {
                            winner = 1;
                        }

                        gameFinished(winner, "Time Up");
                    } else {
                        // Send new board image to other player and update player turn
                        var lastPlayerTurn = playerTurn;
                        if (playerTurn === 0) {
                            botPlayer1.stdin.write(currentGameStateString + "\n");
                            playerTurn = 1;
                        } else {
                            botPlayer0.stdin.write(currentGameStateString + "\n");
                            playerTurn = 0;
                        }
                        playerTimeout = timers.setTimeout(gameFinished, timePerMove, lastPlayerTurn, "Player " + playerTurn + " timed out");
                    }

                });
            }
        } else {
            // do nothing - ignore the data as it's not this guy's turn
        }
    }


    function gameFinished(winner,finishReason) {
        // game has ended
        // disconnect sockets + remove from list
        // log reason to viewer
        console.log("gameFinished Called : " + finishReason);

        // Calculate ELO Rating and write to MONGO
        // ELO Rating is (((won - lost) * 400) + TotalOpponentsRatings) / Total number of games
        if (useRatings) {
            if (winner === -1) {
                WriteELORating(teamNames[0], teamNames[1], "Draw");
                console.log("Game is a draw !!");
            } else {
                WriteELORating(teamNames[0], teamNames[1], teamNames[winner]);
                console.log("Team (" + winner + ") " + teamNames[winner] + " is the winner !!");
            }
        }

        modelProvider.finishGameFile(viewerFilename, '], "finish": "' + finishReason + '" }');

        timers.setTimeout(finish, 2000);

    }//gameFinished

    function finish() {
        process.exit(0);
    }

    function getTeamName(key, callback) {
        MongoClient.connect("mongodb://localhost:27017/BotBall", function (err, db) {
            if (!err) {
                console.log("We are connected to MongoDB");
                var collection = db.collection('teams');
                collection.find({ key: key }).toArray(function (err, docs) {
                    if (!err) {
                        if (docs.length > 0) {
                            console.log("Team is registered : " + docs[0].name);
                            callback(docs[0].name);
                        } else {
                            console.log("Team is NOT registered : " + key);
                            useRatings = false;
                            callback(key);
                        }
                    }
                });
            }
        });
    }

    function WriteELORating(playerName0, playerName1, winner) {

        MongoClient.connect("mongodb://localhost:27017/BotBall", function (err, db) {
            if (!err) {
                //console.log("We are connected to MogoDB");
                var collection = db.collection('teams');
                collection.find({ $or: [{ name: playerName0 }, { name: playerName1}] }).toArray(function (err, docs) {
                    if (!err) {
                        if (docs[0].name === playerName0) {
                            player1 = docs[0];
                            player2 = docs[1];
                        } else {
                            player1 = docs[1];
                            player2 = docs[0];
                        }

                        player1.oppskilltot += player2.skill;
                        player2.oppskilltot += player1.skill;

                        if (winner === "Draw") {
                            player1.drawn += 1;
                            player2.drawn += 1;
                        } else if (winner === player1.name) {
                            player1.won += 1;
                            player1.status = 'verified';
                            player2.lost += 1;
                        } else {
                            player2.won += 1;
                            player2.status = 'verified';
                            player1.lost += 1;
                        }

                        player1.skill = Math.round((((player1.won - player1.lost) * 400) + player1.oppskilltot) / (player1.lost + player1.won + player1.drawn));
                        player2.skill = Math.round((((player2.won - player2.lost) * 400) + player2.oppskilltot) / (player2.lost + player2.won + player2.drawn));

                        //console.log("Player 1 :" + JSON.stringify(player1));
                        //console.log("Player 2 :" + JSON.stringify(player2));

                        collection.save(player1, { w: -1 });
                        collection.save(player2, { w: -1 });

                        var games = db.collection('games');
                        var ts = new Date().getTime();
                        var tss = new Date().toUTCString();
                        games.save({ team1: player1.name, team2: player2.name, gamefile: viewerFilename, result: winner, timestamp: ts, date: tss }, { w: -1 });

                    } else {
                        console.log("ERROR : " + err);
                    }
                });
            }
        });
    }

    function startGame() {

            playerTurn = 0; // Player 0 will start

            // create new visualiser file
           // viewerFilename = teamNames[0] + "v" + teamNames[1] + new Date().getTime() + ".json";
           // viewerFilename = viewerFilename.replace(/{/g, "").replace(/}/g, "");
            EngineParameters.gameFilePath = '';
            viewerFilename = "gamefile.js";
            console.log("Games On " + teamNames[0] + " v " + teamNames[1] + " Registered = " + useRatings);
            //console.log(modelProvider);
            var options = {
                playerNumber: playerTurn,
                fileName: viewerFilename,
                teamNames: teamNames
            };
            // Call the model for the inital state
            modelProvider.initializeGame(options, function (initialGameState) {
                var initalGameStateString = JSON.stringify(initialGameState);
                // Write out initial state then send it to player 0 to make a move

                botPlayer0.stdin.write(initalGameStateString + "\n"); // Tell player to start
                console.log("Init sent to player " + teamNames[playerTurn]);

                playerTimeout = timers.setTimeout(gameFinished, timePerMove, 1, "Player " + playerTurn + " timed out");
                movesPerGame = 1000; //500 per player
            });


        } // Start Game

        runbots(bot0Exe, bot0Name, bot1Exe, bot1Name); // Start up bots and sort out streams

        timers.setTimeout(startGame, 4000);

}

function isJsonComplete(jsonObj) {
    var openBracket = 0;
    var closedBracket = 0;

    for (i = 0; i < jsonObj.length; i++) {
        if (jsonObj[i] === '{') {
            openBracket++;
        } else if (jsonObj[i] === '}') {
            closedBracket++;
        }
    }

    if ((closedBracket < 1) || (closedBracket !== openBracket)) {
        return false;
    }

    return true;

}

exports.start = start;