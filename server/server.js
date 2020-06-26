var express = require("express")
var app = express()
var server = require("http").Server(app)
io = require("socket.io").listen(server)

// var client_url = __dirname.split('/')
// client_url.pop()
// client_url = client_url.join('/') + '/client'

var client_url = __dirname + '/client'

app.use(express.static(client_url))
console.log(client_url)

// const server = require('express')()
// const http = require('http').createServer(server)
// io = require('socket.io')(http)

var Lobby = require('./lobby')
let playersDeprecated = []
let turnData = {}


const pieceValues = {
    'Card05Queen': 0,
    'Card01Soldier': 1,
    'Card02Calvary': 2,
    'Card03Elephant': 3,
    'Card04Shogun': 4,
    'Card06King': 5,
    'Card07Indra': 6,
}

Lobby.initialize()


io.on('connection', function(socket) {
    console.log('A user connected: ' + socket.id)
    playersDeprecated.push(socket.id)
    console.log('playersDeprecated: ' + playersDeprecated)

    socket.on('dealCards', function() {
        turnData = {}
        io.emit('dealCards', createGameData(playersDeprecated), createInvertedGameData(playersDeprecated))
    })

    socket.on('cardPlayed', function(gameId, textureKey, socketId) {
        io.in(gameId).emit('cardPlayed', socketId)
        turnData[gameId][socketId] = textureKey
        console.log()

        if(Object.keys(turnData[gameId]).length === 2) {
            roundFinished(gameId)
        }
    })

    socket.on('disconnect', onClientDisconnect)

    socket.on('enter lobby', Lobby.onEnterLobby)
    socket.on('enter pending game', Lobby.onEnterPendingGame)
    socket.on('leave pending game', Lobby.onLeavePendingGame)
    socket.on('on player ready', onPlayerReady)
    socket.on('on game start', onGameStart)
})

server.listen(process.env.PORT || 3000, function() {
    console.log('Server started')
})

function onPlayerReady(data) {
    var lobbySlots = Lobby.getLobbySlots()
    var lobby = lobbySlots[this.gameId]

    console.log('')
    console.log('Server - onPlayerReady')
    console.log('this.gameId: ' + this.gameId)
    Lobby.onPlayerReady(this, data)
    console.log(lobby)

    if(lobby.ready) {
        console.log('Players Ready')
        console.log(lobby)
        io.in(lobby.id).emit("start game on client", {});
    }
}


function onGameStart(data) {
    var lobbySlots = Lobby.getLobbySlots()
    var lobby = lobbySlots[this.gameId]

    Lobby.onGameStart(this, data)
    
    if(!lobby) {
        return
    }

    var gameStart = Object.values(lobby.players).reduce(function(accumulator, currentValue) {
        return accumulator && currentValue.gameStart
    }, true)

    players = Object.keys(lobby.players)

    if(gameStart) {
        console.log('Start Game')
        turnData[this.gameId] = {}
        io.in(lobby.id).emit('dealCards', createGameData(players), createInvertedGameData(players))
    }
}

function onClientDisconnect() {
    
    console.log('A user disconnected: ' + this.id)
    playersDeprecated = playersDeprecated.filter(playersDeprecated => playersDeprecated !== this.id)
    console.log(this.gameId)
	if (this.gameId == null) {
		return;
	}

	var lobbySlots = Lobby.getLobbySlots();

    console.log(lobbySlots[this.gameId])

	if (lobbySlots[this.gameId].state == "joinable" || lobbySlots[this.gameId].state == "full") {
		Lobby.onLeavePendingGame.call(this);
	} else if (lobbySlots[this.gameId].state == "settingup") {
		lobbySlots[this.gameId].state = "empty";

		Lobby.broadcastSlotStateUpdate(this.gameId, "empty");
	} else if(lobbySlots[this.gameId].state == "inprogress") {
		var game = games[this.gameId];
	
		if(this.id in game.players) {
			console.log("deleting " + this.id);
			delete game.players[this.id];
	
			io.in(this.gameId).emit("remove player", {id: this.id});	
		}

		if(game.numPlayers < 2) {
			if(game.numPlayers == 1) {
				io.in(this.gameId).emit("no opponents left");
			}
			terminateExistingGame(this.gameId);
		}

		if(game.awaitingAcknowledgements && game.numEndOfRoundAcknowledgements >= game.numPlayers) {
			game.awaitingAcknowledgements = false;
		}
	}
}

function roundFinished(gameId) {
    console.log('roundFinished')
    console.log(gameId)
    console.log(turnData[gameId])

    var lobbySlots = Lobby.getLobbySlots()
    var lobby = lobbySlots[gameId]
    console.log(lobbySlots)
    console.log(lobby)
    players = Object.keys(lobby.players)

    var player1PointValue = pieceValues[turnData[gameId][players[0]]]
    var player2PointValue = pieceValues[turnData[gameId][players[1]]]

    var roundData = {}
    roundData[players[0]] = {}
    roundData[players[1]] = {}
    roundData[players[0]]['piece'] = turnData[gameId][players[0]]
    roundData[players[0]]['opponentPiece'] = turnData[gameId][players[1]]
    roundData[players[1]]['piece'] = turnData[gameId][players[1]]
    roundData[players[1]]['opponentPiece'] = turnData[gameId][players[0]]
    if(player1PointValue > player2PointValue) {
        roundData[players[0]]['roundWinner'] = true
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "You Win"
        roundData[players[1]]['zoneText'] = "You Lose"
        roundData[players[0]]['destroyPiece'] = false
        roundData[players[1]]['destroyPiece'] = true
        roundData['isDraw'] = false
        roundData['isGameOver'] = false
    } else if(player1PointValue < player2PointValue) {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = true
        roundData[players[0]]['zoneText'] = "You Lose"
        roundData[players[1]]['zoneText'] = "You Win"
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = false
        roundData['isDraw'] = false
        roundData['isGameOver'] = false
    } else if(player1PointValue === player2PointValue) {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "Draw: Both Pieces Destroyed"
        roundData[players[1]]['zoneText'] = "Draw: Both Pieces Destroyed"
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = true
        roundData['isDraw'] = true
        roundData['isGameOver'] = false
    }

    if(turnData[gameId][players[0]] === 'Card07Indra') {
        roundData[players[0]]['destroyPiece'] = true
    } else if(turnData[gameId][players[1]] === 'Card07Indra') {
        roundData[players[1]]['destroyPiece'] = true
    } 

    if(turnData[gameId][players[0]] === 'Card07Indra' && turnData[gameId][players[1]] === 'Card06King') {
        roundData[players[0]]['roundWinner'] = true
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "You Win The Game"
        roundData[players[1]]['zoneText'] = "You Lose The Game"
        roundData[players[0]]['destroyPiece'] = false
        roundData[players[1]]['destroyPiece'] = true
        roundData['isDraw'] = false
        roundData['isGameOver'] = true
    } else if(turnData[gameId][players[0]] === 'Card06King' && turnData[gameId][players[1]] === 'Card07Indra') {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = true
        roundData[players[0]]['zoneText'] = "You Lose The Game"
        roundData[players[1]]['zoneText'] = "You Win The Game"
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = false
        roundData['isDraw'] = false
        roundData['isGameOver'] = true
    }

    if(turnData[gameId][players[0]] === 'Card05Queen' && turnData[gameId][players[1]] === 'Card06King') {
        roundData[players[0]]['roundWinner'] = true
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "You Win The Game"
        roundData[players[1]]['zoneText'] = "You Lose The Game"
        roundData[players[0]]['destroyPiece'] = false
        roundData[players[1]]['destroyPiece'] = true
        roundData['isDraw'] = false
        roundData['isGameOver'] = true
    } else if(turnData[gameId][players[0]] === 'Card06King' && turnData[gameId][players[1]] === 'Card05Queen') {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = true
        roundData[players[0]]['zoneText'] = "You Lose The Game"
        roundData[players[1]]['zoneText'] = "You Win The Game"
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = false
        roundData['isDraw'] = false
        roundData['isGameOver'] = true
    }

    if(turnData[gameId][players[0]] === 'Card06King' && turnData[gameId][players[1]] === 'Card06King') {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "Both Kings destroyed, Both players lose"
        roundData[players[1]]['zoneText'] = "Both Kings destroyed, Both players lose"
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = true
        roundData['isDraw'] = true
        roundData['isGameOver'] = true
    } 

    io.in(gameId).emit('turnFinished', roundData)
    turnData[gameId] = {}
    if(!roundData['isGameOver']) {
        setTimeout(function() { 
            io.in(gameId).emit('newRound', roundData)
        }, 4000);
    } else if(roundData['isGameOver']) {
        setTimeout(function() { 
            io.in(gameId).emit('endGame', roundData)
        }, 4000);
    }
}

function createGameData(players) {
    var rv = {};
    for (var i = 0; i < players.length; ++i) {
        rv[players[i]] = i + 1
    }
    console.log(rv)
    return rv;
}

function createInvertedGameData(players) {
    var rv = {};
    for (var i = 0; i < players.length; ++i) {
        rv[i+1] = players[i]
    }
    console.log(rv)
    return rv;
}