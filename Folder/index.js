const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

let player1Position = null;
let player2Position = null;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes for Player 1 and Player 2 movements
app.get('/update1', (req, res) => {
    player1Position = req.query.PositionOfPlayerOne;
    console.log('Player 1 position updated:', player1Position);
    res.send('Position updated for Player 1');
});

app.get('/update2', (req, res) => {
    player2Position = req.query.PositionOfPlayerTwo;
    console.log('Player 2 position updated:', player2Position);
    res.send('Position updated for Player 2');
});

// Route to send Player 1 position to Player 2
app.get('/move1', (req, res) => {
    console.log('Sending Player 1 position to Player 2:', player1Position);
    res.send(player1Position);
});

// Route to send Player 2 position to Player 1
app.get('/move2', (req, res) => {
    console.log('Sending Player 2 position to Player 1:', player2Position);
    res.send(player2Position);
});

// Define routes for playerJoin and playerLeave
app.get('/playerJoin', (req, res) => {
    // Handle the player join logic here
    console.log('Player join request received');
    io.emit('serverLog', 'Player join request received');
    res.send('Player joined your Server');
});

app.get('/playerLeave', (req, res) => {
    // Handle the player leave logic here
    console.log('Player left the game');
    io.emit('serverLog', 'Player left the game');
    res.send('Player left your Server');
});

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log(`Player ${socket.id} connected`);
    io.emit('serverLog', `Player ${socket.id} connected`);

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);
        io.emit('serverLog', `Player ${socket.id} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
