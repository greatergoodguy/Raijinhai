const uuid = require('uuid')

var lobbySlots = {};
var lobbyId = -1;
var numLobbySlots = 7;
var PendingGame = require("./entities/pending_game")

var Lobby = {
	getLobbySlots: function() {
		return lobbySlots;
	},

	getLobbyId: function() {
		return lobbyId;
	},

	getNumLobbySlots: function() {
		return numLobbySlots;
	},

	broadcastSlotStateUpdate: function(gameId, newState) {
		broadcastSlotStateUpdate(gameId, newState);
	},

	initialize: function() {

		for(var i = 0; i < numLobbySlots; i++) {
			let id = uuid.v4()
			lobbySlots[id] = new PendingGame(id, i + 1);
		}
		console.log(lobbySlots)
	},

	onEnterLobby: function(data) {
		console.log('Lobby.onEnterLobby()')
		//console.log(lobbySlots)
		this.join(lobbyId);
		io.in(lobbyId).emit("add slots", lobbySlots);
	},

	onHostGame: function(data) {
		lobbySlots[data.gameId].state = "settingup";
		this.gameId = data.gameId;
		broadcastSlotStateUpdate(data.gameId, "settingup");
	},

	onStageSelect: function(data) {
		lobbySlots[this.gameId].state = "joinable";
		lobbySlots[this.gameId].mapName = data.mapName;
		broadcastSlotStateUpdate(this.gameId, "joinable");
	},

	onEnterPendingGame: function(data) {
		console.log('Lobby.onEnterPendingGame()')

		var pendingGame = lobbySlots[data.gameId];
		pendingGame.state = "joinable"
	
		this.leave(lobbyId);
		this.join(data.gameId);
	
		pendingGame.addPlayer(this.id);

		console.log(pendingGame)

		this.gameId = data.gameId;
	
		this.emit("show current players", {players: pendingGame.players});
		this.broadcast.to(data.gameId).emit("player joined", {players: pendingGame.players});
		broadcastSlotStateUpdate(data.gameId, pendingGame);
	},

	onLeavePendingGame: function(data) {
		leavePendingGame.call(this);
	},

	onPlayerReady: function(socket, data) {
		console.log('Lobby.onPlayerReady()')
		var pendingGame = lobbySlots[data.gameId]
		pendingGame['players'][data.playerId]['ready'] = data.ready

		socket.broadcast.to(data.gameId).emit("player ready", {players: pendingGame.players})

		console.log(Object.keys(pendingGame.players).length)
		//console.log(Object.values(pendingGame.players))

		var roomHasTwoPlayers = Object.keys(pendingGame.players).length == 2
		
		var allPlayersAreReady = Object.values(pendingGame.players).reduce(function(accumulator, currentValue) {
			console.log(currentValue)
			return accumulator && currentValue.ready
		}, true)
		console.log('roomHasTwoPlayers: ' + roomHasTwoPlayers)
		console.log('allPlayersAreReady: ' + allPlayersAreReady)
		if(roomHasTwoPlayers && allPlayersAreReady) {
			pendingGame.ready = true
		} else {
			pendingGame.ready = false
		}
	},

	onGameStart: function(socket, data) {
		console.log('Lobby.onGameStart()')
		var pendingGame = lobbySlots[data.gameId]
		pendingGame['players'][data.playerId]['gameStart'] = true
	}
};

function startGameInLobby() {
	console.log('Lobby.startGameInLobby()')
	startGame()
}

function broadcastSlotStateUpdate(gameId, pendingGame) {
	io.in(lobbyId).emit("update slot", {gameId: gameId, pendingGame: pendingGame});
};

function leavePendingGame() {
	console.log('Lobby.leavePendingGame()')
	var lobbySlot = lobbySlots[this.gameId];

	this.leave(this.gameId);
	lobbySlot.removePlayer(this.id);
	io.in(this.gameId).emit("player left", {players: lobbySlot.players});
	io.in(lobbyId).emit("update slot", {gameId: this.gameId, pendingGame: lobbySlot});
};

module.exports = Lobby;