import {Router} from "express";
import users from "./api/users";
import ping from "./api/ping";
import games from "./api/games";


const api = Router();


api.use('/users', users);
api.use('/ping', ping);
api.use('/games', games);

export default api;