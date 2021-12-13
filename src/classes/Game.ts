import Board from "./Board";

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

    constructor(config?: IGameConfig) {
        this.config = {
            boardSize: {width: 9, height: 7},
            winLength: 4,
            maxPlayers: 8,
            ...config,
        };
        this.board = new Board(this.config.boardSize?.width, this.config.boardSize?.height);
    }

}


export default Game;
export {IGameConfig};