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

			//lobbySlots.push(new PendingGame(uuid.v4(), i + 1));
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

		console.log(data)
		var pendingGame = lobbySlots[data.gameId];
		pendingGame.state = "joinable"
		console.log(pendingGame)
	
		this.leave(lobbyId);
		this.join(data.gameId);
	
		pendingGame.addPlayer(this.id);
		this.gameId = data.gameId;
	
		this.emit("show current players", {players: pendingGame.players});
		this.broadcast.to(data.gameId).emit("player joined", {id: this.id, color: pendingGame.players[this.id].color});
		broadcastSlotStateUpdate(data.gameId, pendingGame);
	},

	onLeavePendingGame: function(data) {
		leavePendingGame.call(this);
	}
};

function broadcastSlotStateUpdate(gameId, pendingGame) {
	io.in(lobbyId).emit("update slot", {gameId: gameId, pendingGame: pendingGame});
};

function leavePendingGame() {
	console.log('Lobby.leavePendingGame()')
	var lobbySlot = lobbySlots[this.gameId];

	this.leave(this.gameId);
	lobbySlot.removePlayer(this.id);
	io.in(this.gameId).emit("player left", {players: lobbySlot.players});

	if(lobbySlot.getNumPlayers()== 0) {
		lobbySlot.state = "empty";
		io.in(lobbyId).emit("update slot", {gameId: this.gameId, pendingGame: lobbySlot});
	}

	if(lobbySlot.state == "full") {
		lobbySlot.state = "joinable";
		io.in(lobbyId).emit("update slot", {gameId: this.gameId, pendingGame: lobbySlot});
	}
};

module.exports = Lobby;