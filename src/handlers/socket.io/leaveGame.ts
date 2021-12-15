import {Socket} from "socket.io";
import games from "../../instances/games";
import {updateGame, updateLobbies} from "../../functions/emitters";


function leaveGameHandler(this: Socket, payload: { gameUUID: string }) {
    const game = games.getGame(payload.gameUUID);
    const user = game?.players.getUser(this.data.user.uuid);

    if (game && user) {
        game.removeUser(user);

        updateLobbies();
        updateGame(game)
    }
}


export default leaveGameHandler;