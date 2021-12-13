import Board from "./Board";
import Users from "./Users";
import {generateUUID} from "../lib/helpers";
import { hash } from 'bcrypt';


class Game {

    public name: string;
    public uuid: string;
    public board: Board;
    public config: IGameConfig;
    public players: Users;
    public gravity: {x: -1 | 0 | 1, y: -1 | 0 | 1};

    constructor(name: string, config?: IGameConfig) {
        this.config = {
            boardSize: {width: 9, height: 7},
            winLength: 4,
            maxPlayers: 8,
            password: '',
            powerUps: false,
            ...config,
        };
        this.hashPassword().then();
        this.name = name;
        this.uuid = generateUUID();
        this.board = new Board(this.config.boardSize?.width, this.config.boardSize?.height);
        this.players = new Users();
        this.gravity = {x: 0, y: 1};
    }

    public applyGravity(): void { // O(this.board.width * this.board.height * (this.board.width | this.board.height))
        if (Math.abs(this.gravity.x) + Math.abs(this.gravity.y) > 1) return; // Prevent Applying Diagonal Gravity
        for (let i = 0; i < (this.gravity.x !== 0 ? this.board.height : this.board.width); i++) {
            if (this.gravity.x !== 0) { // Horizontal Gravity
                for (let x = 0; x < this.board.width; x++) {
                    const cell = this.board.getCell(this.gravity.x === 1 ? this.board.width - 1 - x : x, i);
                    this.board.move(cell, this.gravity.x, 0);
                }
            } else { // Vertical Gravity
                for (let y = 0; y < this.board.height; y++) {
                    const cell = this.board.getCell(i, this.gravity.y === 1 ? this.board.height - 1 - y : y);
                    this.board.move(cell, 0, this.gravity.y);
                }
            }
        }
    }

    public checkPlayersAlive(): void {
        this.players.checkAlive();
    }

    private async hashPassword(): Promise<void> {
        if (this.config.password && this.config.password !== '') await hash(this.config.password, 10);
    }
}


export default Game;