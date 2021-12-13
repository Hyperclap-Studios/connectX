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
}

export default User;