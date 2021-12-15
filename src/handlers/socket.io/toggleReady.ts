import {Socket} from "socket.io";
import games from "../../instances/games";
import {updateGame} from "../../functions/emitters";


function toggleReadyHandler(this: Socket, payload: any) {
    const game = games.getGame(payload.gameUUID);
    const user = game?.players.getUser(this.data.user.uuid);

    if (game && user && game.state === 'waiting') {
        user.gameData.isReady = !user.gameData.isReady;
        if (user.gameData.isReady) {
            game.tryStart();
        }
        updateGame(game);
    }
}


export default toggleReadyHandler;