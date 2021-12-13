import {generateUUID} from "../lib/helpers";

class User {

    public uuid: string;
    public username: string;
    public color: TUserColor;
    public lastPing: number;
    public socketId: string;
    public gameData: IUserGameData;

    constructor(username: string) {

        this.username = username;
        this.color = '';
        this.lastPing = Date.now();
        this.uuid = generateUUID();
        this.socketId = '';
        this.gameData = {
            hasTurn: false,
        };

    }

    public isAlive(): boolean {
        return Date.now() - this.lastPing < (parseInt(<string>process.env.PLAYER_TIMEOUT) || 30) * 1000;
    }

}


export default User;