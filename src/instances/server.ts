import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "../middleware/express/logger";
import api from "../routes/api";
import authentication from "../middleware/socket.io/authentication";

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

export {app, server, io};