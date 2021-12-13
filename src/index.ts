import {config} from 'dotenv';
import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
import api from "./routes/api";
import logger from "./middleware/express/logger";
import authentication from "./middleware/socket.io/authentication";


// Load Environment Variables
config();


// Variables
const PORT = process.env.PORT || 8080;


// Initialisation
const app = express();
const server = createServer(app);
const io = new Server(server);


// Middleware And Routes
app.use(cors())
app.use(bodyParser.json());
app.use(logger);
app.use('/api', api);


// Verify JWT
io.use(authentication);

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