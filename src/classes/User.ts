import {generateUUID} from "../lib/helpers";


interface IUserGameData {
    hasTurn: boolean,
}


class User {

    public uuid: string;
    public username: string;
    public lastPing: number;
    public socketId: string;
    public gameData: IUserGameData;

    constructor(username: string) {

        this.username = username;
        this.lastPing = Date.now();
        this.uuid = generateUUID();
        this.socketId = '';
        this.gameData = {
            hasTurn: false,
        };

    }

    public isAlive(): boolean {
        return Date.now() - this.lastPing < (parseInt(<string>process.env.PLAYER_TIMEOUT) || 10) * 1000;
    }

}


export default User;