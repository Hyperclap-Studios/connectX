import {generateUUID} from "../lib/helpers";

class User {

    public uuid: string;
    public username: string;
    public color: TUserColor;
    public lastPing: number;
    public lastGamePing: number;
    public socketId: string;
    public gameData: IUserGameData;

    constructor(username: string, uuid?: string) {

        this.username = username;
        this.color = '';
        this.lastPing = Date.now();
        this.lastGamePing = Date.now();
        this.uuid = uuid ? uuid : generateUUID();
        this.socketId = '';
        this.gameData = {
            hasTurn: false,
        };

    }

    public isAlive(): boolean {
        return Date.now() - this.lastPing < (parseInt(<string>process.env.PLAYER_TIMEOUT) || 30) * 1000;
    }

    public inGame(): boolean {
        return Date.now() - this.lastGamePing < (parseInt(<string>process.env.GAME_TIMEOUT) || 10) * 1000;
    }

    public getClientUser() {
        return {
            uuid: this.uuid,
            username: this.username,
            color: this.color,
            gameData: this.gameData,
        };
    }

}


export default User;