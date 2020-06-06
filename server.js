const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)
let players = []
let turnData = {}

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
        console.log(turnData)

        if(Object.keys(turnData).length === 2) {
            setTimeout(function() { 
                io.emit('turnFinished', turnData)
             }, 1000);
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