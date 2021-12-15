import Board from "./Board";
import Users from "./Users";
import {generateUUID} from "../lib/helpers";
import {compare, hash} from 'bcrypt';
import {sign, verify} from "jsonwebtoken";
import User from "./User";


class Game {

    public name: string;
    public uuid: string;
    public board: Board;
    public config: IGameConfig;
    public players: Users;
    public gravity: {x: -1 | 0 | 1, y: -1 | 0 | 1};
    public state: 'waiting' | 'playing' | 'finished';
    public winner: User | null;
    public pendingRestart: boolean;
    public lastPing: number;

    constructor(name: string, config?: IGameConfig) {
        this.config = {
            boardSize: {width: 9, height: 7},
            winLength: 4,
            maxPlayers: 8,
            password: '',
            powerUps: false,
            gameMode: 'classic',
            ...config,
        };
        this.hashPassword().then();
        this.name = name;
        this.uuid = generateUUID();
        this.board = new Board(this.config.boardSize?.width, this.config.boardSize?.height);
        this.players = new Users();
        this.gravity = {x: 0, y: 1};
        this.state = 'waiting';
        this.winner = null;
        this.pendingRestart = false;
        this.lastPing = Date.now();
    }

    public start(): void {
        this.state = 'playing';
        this.board.initGrid();
        this.gravity = {x: 0, y: 1};
        this.winner = null;
        this.players.users[Math.round(Math.random() * (this.players.users.length - 1))].gameData.hasTurn = true;
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
                const oldIndex = this.players.users.indexOf(user);
                this.players.removeUser(user);
                if (this.state === 'playing') {
                    if (this.players.users.length === 1) {
                        this.endGame(this.players.users[0]);
                    } else if (user.gameData.hasTurn) {
                        this.nextTurn(user, 0, oldIndex);
                    }
                }
            }
        });
    }

    public checkReady(): boolean {
        if (this.players.users.length < 2) return false;

        let ready = true;
        this.players.users.forEach(user => {
            if (!user.gameData.isReady) ready = false;
        });
        return ready;
    }

    public tryStart(): void {
        if (this.checkReady()) {
            this.start();
        }
    }

    public getClientGame() {
        return {
            name: this.name,
            uuid: this.uuid,
            board: this.board,
            players: this.players.clientUsers,
            gravity: this.gravity,
            state: this.state,
            winner: this.winner?.getClientUser() ?? null,
            gameMode: this.config.gameMode ?? 'classic',
        };
    }

    public checkPlayersAlive(): void {
        this.players.checkAlive();
    }

    public nextTurn(oldUser: User, offset: number = 1, oldIndex?: number): void {
        const index = oldIndex ? oldIndex : this.players.users.indexOf(oldUser);
        oldUser.gameData.hasTurn = false;
        const next = (index + offset) % this.players.users.length;
        console.log(next);
        this.players.users[next].gameData.hasTurn = true;
    }

    public endGame(winner: User) {
        this.winner = winner;
        this.state = 'finished';
        this.players.users.forEach(user => {
            user.gameData.hasTurn = false;
            user.gameData.isReady = false;
        });
    }

    public tryMove(uuid: string, x: number, y: number): boolean {
        const user = this.players.getUser(uuid);
        if (user && this.config.winLength && user.gameData.hasTurn) {
            const cell = this.board.getCell(x, y);
            if (cell && cell.state === null) {
                cell.color = user.color;
                cell.state = user.uuid;
                this.applyGravity();
                const connections = this.board.checkConnection(this.config.winLength);
                if (connections && connections.length > 0) {
                    this.endGame(user);
                } else {
                    if (this.config.gameMode === 'gravitySwitch') this.nextGravity();
                    this.nextTurn(user);
                }
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