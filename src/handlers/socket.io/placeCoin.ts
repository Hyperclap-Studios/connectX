import {Socket} from "socket.io";
import games from "../../instances/games";
import {updateGame} from "../../functions/emitters";


function placeCoinHandler(this: Socket, payload: IPlaceCoinPayload) {
    const game = games.getGame(payload.gameUUID);

    if (game) {
        const success = game.tryMove(this.data.user.uuid, payload.x, payload.y);
        if (success) updateGame(game);
    }
}

export default placeCoinHandler;