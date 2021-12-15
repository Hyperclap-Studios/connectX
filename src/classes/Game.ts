import Board from "./Board";
import Users from "./Users";
import {generateUUID} from "../lib/helpers";
import {compare, hash} from 'bcrypt';
import {sign, verify} from "jsonwebtoken";


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

    public getJWT(): string | null {
        if (process.env.JWT_SECRET) {
            return sign({
                name: this.name,
                uuid: this.uuid,
            }, process.env.JWT_SECRET);
        }
        return null;
    }

    public verifyJWT(token: string): boolean {
        if (process.env.JWT_SECRET) {
            try {
                const payload = verify(token, process.env.JWT_SECRET) as IGameJWTPayload;
                return payload.uuid === this.uuid;
            } catch (e: any) {
                return false;
            }
        }
        return false;
    }

    public async checkPassword(password: string): Promise<boolean> {
        if (this.config.password && this.config.password !== '') {
            return await compare(password, this.config.password);
        }
        return true;
    }

    public checkPlayersInGame(): void {
        this.players.users.forEach(user => {
            if (!user.inGame()) {
                console.log(`Removed user ${user.username} from game ${this.name} due to inactivity`);
                this.players.removeUser(user);
            }
        });
    }

    public getClientGame() {
        return {
            name: this.name,
            uuid: this.uuid,
            board: this.board,
            players: this.players.clientUsers,
            gravity: this.gravity,
        };
    }

    public checkPlayersAlive(): void {
        this.players.checkAlive();
    }

    public tryMove(uuid: string, x: number, y: number): boolean {
        const user = this.players.getUser(uuid);
        if (user && this.config.winLength) {
            const cell = this.board.getCell(x, y);
            if (cell && cell.state === null) {
                cell.color = user.color;
                cell.state = user.uuid;
                this.applyGravity();
                const connections = this.board.checkConnection(this.config.winLength);
                console.log(connections);
                this.nextGravity();
                return true;
            }
        }
        return false;
    }

    public nextGravity(): void {
        if (this.gravity.y === 1) {
            this.gravity.y = 0;
            this.gravity.x = 1;
        } else if (this.gravity.x === 1) {
            this.gravity.x = 0;
            this.gravity.y = -1;
        } else if (this.gravity.y === -1) {
            this.gravity.y = 0;
            this.gravity.x = -1;
        } else if (this.gravity.x === -1) {
            this.gravity.x = 0;
            this.gravity.y = 1;
        }
    }

    private async hashPassword(): Promise<void> {
        if (this.config.password && this.config.password !== '') this.config.password = await hash(this.config.password, 10);
    }
}


export default Game;