import {Router} from "express";
import user from "./api/user";


const api = Router();


api.use('/user', user);


export default api;