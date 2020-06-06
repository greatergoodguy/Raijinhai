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

    var player1PointValue = pieceValues[turnData[players[0]]]
    var player2PointValue = pieceValues[turnData[players[1]]]

    var roundData = {}
    roundData[players[0]] = {}
    roundData[players[1]] = {}
    if(player1PointValue > player2PointValue) {
        roundData[players[0]]['roundWinner'] = true
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "You Win"
        roundData[players[1]]['zoneText'] = "You Lose"
        roundData[players[0]]['isDraw'] = false
        roundData[players[1]]['isDraw'] = false
        roundData[players[0]]['destroyPiece'] = false
        roundData[players[1]]['destroyPiece'] = true
    } else if(player1PointValue < player2PointValue) {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = true
        roundData[players[0]]['zoneText'] = "You Lose"
        roundData[players[1]]['zoneText'] = "You Win"
        roundData[players[0]]['isDraw'] = false
        roundData[players[1]]['isDraw'] = false
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = false
    } else if(player1PointValue === player2PointValue) {
        roundData[players[0]]['roundWinner'] = false
        roundData[players[1]]['roundWinner'] = false
        roundData[players[0]]['zoneText'] = "Draw: Both Pieces Destroyed"
        roundData[players[1]]['zoneText'] = "Draw: Both Pieces Destroyed"
        roundData[players[0]]['isDraw'] = true
        roundData[players[1]]['isDraw'] = true
        roundData[players[0]]['destroyPiece'] = true
        roundData[players[1]]['destroyPiece'] = true
    }

    if(turnData[players[0]] === 'Card07Indra') {
        roundData[players[0]]['destroyPiece'] = true
    } else if(turnData[players[1]] === 'Card07Indra') {
        roundData[players[1]]['destroyPiece'] = true
    } 

    io.emit('turnFinished', roundData)
    setTimeout(function() { 
        io.emit('newRound', roundData)
        turnData = {}
    }, 4000);
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