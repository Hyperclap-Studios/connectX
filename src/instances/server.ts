import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "../middleware/express/logger";
import api from "../routes/api";
import authentication from "../middleware/socket.io/authentication";
import connectionHandler from "../handlers/socket.io/connection";

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

// Websocket
io.on('connection', connectionHandler);

export {app, server, io};