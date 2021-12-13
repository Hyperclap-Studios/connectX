import {io} from "../instances/server";
import games from "../instances/games";
import {Socket} from "socket.io";


const pingUsers = () => {
    io.emit('user_ping', {
        msg: 'ping',
    });
};

const updateLobbies = (socket?: Socket): boolean => {
    let target = socket ? socket : io;
    return target.emit('update_lobbies', {
        lobbies: games.getLobbies(),
    });
};

export { pingUsers, updateLobbies };