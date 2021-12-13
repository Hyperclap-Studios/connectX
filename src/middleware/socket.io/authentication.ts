import { Socket } from 'socket.io';
import {verify} from "jsonwebtoken";


const authentication = (socket: Socket, next: any) => {

    const token = socket.handshake.auth.token; // JWT

    if (process.env.JWT_SECRET) {

        const payload = verify(token, process.env.JWT_SECRET);

        if (payload) {

            socket.data.user = payload;

            next();

        } else {

            next(new Error("Authentication error"));

        }
    } else {

        next(new Error("No JWT_SECRET"));

    }
};


export default authentication;