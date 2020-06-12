const uuid = require('uuid')

// Store this somewhere as metadata?
var colorIndices = {
	"white": 0,
	"black": 1
}

var PendingGame = function(id, roomNumber) {
    this.players = {}
    this.id = id
    this.roomNumber = roomNumber
	this.state = "empty"
	this.colors = [{colorName: "white", available: true}, {colorName: "black", available: true}]
}

PendingGame.prototype = {
	getPlayerIds: function() {
		return Object.keys(this.players)
	},

	getNumPlayers: function() {
		return Object.keys(this.players).length
	},

	removePlayer: function(id) {
		this.colors[colorIndices[this.players[id].color]].available = true
		delete this.players[id]
	},

	addPlayer: function(id) {
		this.players[id] = {color: this.claimFirstAvailableColor()}
	},

	claimFirstAvailableColor: function() {
		for(var i = 0; i < this.colors.length; i++) {
			var color = this.colors[i]
			if(color.available) {
				color.available = false
				return color.colorName
			}
		}
	}
};

module.exports = PendingGame