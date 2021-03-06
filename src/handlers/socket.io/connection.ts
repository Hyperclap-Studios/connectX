import { Socket } from 'socket.io';
import games from "../../instances/games";
import disconnectHandler from "./disconnect";
import userPingHandler from "./userPing";
import {updateLobbies} from "../../functions/emitters";
import users from "../../instances/users";
import User from "../../classes/User";
import gamePingHandler from "./gamePing";
import placeCoinHandler from "./placeCoin";
import toggleReadyHandler from "./toggleReady";
import leaveGameHandler from "./leaveGame";


const connectionHandler = (socket: Socket) => {
    console.log('Client connected.');

    const user = users.getUser(socket.data.user.uuid);

    if (!user) {
        const user = new User(socket.data.user.username, socket.data.user.uuid);
        user.socketId = socket.id;
        users.addUser(user);
    } else {
        user.lastPing = Date.now();
        user.socketId = socket.id;
    }

    socket.on('disconnect', disconnectHandler);
    socket.on('user_ping', userPingHandler);
    socket.on('game_ping', gamePingHandler);
    socket.on('place_coin', placeCoinHandler);
    socket.on('toggle_ready', toggleReadyHandler);
    socket.on('leave_game', leaveGameHandler);

    socket.emit('update_games', games);

    updateLobbies(socket);
}

export default connectionHandler;