import {config} from 'dotenv';
import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';

config();

const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}.`);
});