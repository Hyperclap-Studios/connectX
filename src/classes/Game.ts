import Board from "./Board";
import Users from "./Users";

interface IGameConfig {
    boardSize?: {width: number, height: number},
    winLength?: number,
    maxPlayers?: number,
    password?: string,
    powerUps?: boolean,
}

class Game {

    public board: Board;
    public config: IGameConfig;
    public players: Users;

    constructor(config?: IGameConfig) {
        this.config = {
            boardSize: {width: 9, height: 7},
            winLength: 4,
            maxPlayers: 8,
            password: '',
            powerUps: false,
            ...config,
        };
        this.board = new Board(this.config.boardSize?.width, this.config.boardSize?.height);
        this.players = new Users();
    }

    public checkPlayersAlive(): void {
        this.players.checkAlive();
    }
}


export default Game;
export {IGameConfig};