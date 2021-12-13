import Game from "./Game";


class Games {

    public games: Game[];

    constructor() {
        this.games = [];
    }

    public addGame(game: Game): number {
        return this.games.push(game);
    }

    public removeGame(game: Game): Game[] {
        return this.games.splice(this.games.indexOf(game), 1);
    }

    public removeGameByUUID(uuid: string): Game[] {
        return this.games.splice(this.games.findIndex(game => game.uuid === uuid), 1);
    }

    public getGame(uuid: string): Game | null {
        return this.games.find(game => game.uuid === uuid) ?? null;
    }

    public checkPlayersAlive(): void {
        this.games.forEach(game => {
            game.checkPlayersAlive();
        });
    }


}


export default Games;