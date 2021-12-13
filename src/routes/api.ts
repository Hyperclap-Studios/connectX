import {Router} from "express";
import users from "./api/users";
import ping from "./api/ping";


const api = Router();


api.use('/users', users);
api.use('/ping', ping);


export default api;