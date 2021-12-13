import {config} from 'dotenv';
import users from "./instances/users";
import {io, server} from './instances/server';
import Game from "./classes/Game";

// Load Environment Variables
config();


// Variables
const PORT = process.env.PORT || 8080;


// Initialisation
new Game('test');


io.on('connection', (socket) => {
    console.log('Client connected.');

    socket.on('disconnect', () => {

        console.log('Client disconnected.');

    });
});


// Listen
server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}.`);
});


// Check Lifecycles
setInterval(() => {

    users.checkAlive();

}, 1000);