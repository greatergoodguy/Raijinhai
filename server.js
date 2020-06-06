const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)
let players = []
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

io.on('connection', function(socket) {
    console.log('A user connected: ' + socket.id)
    players.push(socket.id)
    console.log('players: ' + players)

    socket.on('dealCards', function() {
        turnData = {}
        io.emit('dealCards', createGameData(players), createInvertedGameData(players))
    })

    socket.on('cardPlayed', function(textureKey, socketId) {
        io.emit('cardPlayed', textureKey, socketId)
        turnData[socketId] = textureKey
        console.log()

        if(Object.keys(turnData).length === 2) {
            roundFinished(turnData)
            // io.emit('turnFinished', turnData)
            // setTimeout(function() { 
            //     io.emit('newRound', turnData)
            //     turnData = {}
            // }, 4000);
        }
    })

    socket.on('disconnect', function() {
        console.log('A user disconnected: ' + socket.id)
        players = players.filter(player => player !== socket.id)
    })
})

http.listen(3000, function() {
    console.log('Server started')
})

function roundFinished() {
    console.log('roundFinished')
    io.emit('turnFinished', turnData)
    setTimeout(function() { 
        io.emit('newRound', turnData)
        turnData = {}
    }, 4000);

    // let playerPointValue = pieceValues[turnData[socket.id]]
    // let opponentPointValue = pieceValues[turnData[self.opponentId]]
    // console.log('playerPointValue: ' + playerPointValue)
    // console.log('opponentPointValue: ' + opponentPointValue)
    // console.log(self.opponentZoneCard)

    // if(playerPointValue > opponentPointValue) {
    //     self.zoneText.setText("You Win")
    // } else if(playerPointValue < opponentPointValue) {
    //     self.zoneText.setText("You Lose")
    // } else if(playerPointValue === opponentPointValue) {
    //     self.zoneText.setText("Draw: Both Pieces Destroyed")
    // }

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