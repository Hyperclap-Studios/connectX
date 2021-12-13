import { Socket } from 'socket.io';
import games from "../../instances/games";
import disconnectHandler from "./disconnect";
import userPingHandler from "./userPing";
import {updateLobbies} from "../../functions/emitters";


const connectionHandler = (socket: Socket) => {
    console.log('Client connected.');

    socket.on('disconnect', disconnectHandler);
    socket.on('user_ping', userPingHandler);

    socket.emit('update_games', games);

    updateLobbies(socket);
}

export default connectionHandler;