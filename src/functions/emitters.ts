import {io} from "../instances/server";
import games from "../instances/games";
import {Socket} from "socket.io";
import Game from "../classes/Game";


const pingUsers = () => {
    io.emit('user_ping', {
        msg: 'ping',
    });
};

const pingGameUsers = () => {
    io.emit('game_ping', {
        msg: 'ping',
    });
};

const updateLobbies = (socket?: Socket): boolean => {
    let target = socket ? socket : io;
    return target.emit('update_lobbies', {
        lobbies: games.getLobbies(),
    });
};

const updateGame = (game: Game): void => {
    game.players.users.forEach(user => {
        io.to(user.socketId).emit('update_game', {
            game: game.getClientGame(),
        });
    });
}

export { pingUsers, pingGameUsers, updateLobbies, updateGame };