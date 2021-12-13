import {Socket} from "socket.io";
import games from "../../instances/games";


function gamePingHandler(this: Socket, payload: IGamePingPayload) {
    const game = games.getGame(payload.uuid);
    const user = game?.players.getUser(this.data.user.uuid);

    if (game && user) {
        user.lastGamePing = Date.now();
    }
};


export default gamePingHandler;