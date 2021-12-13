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

    public getGameByName(name: string): Game | null {
        return this.games.find(game => game.name.toLowerCase() === name.toLowerCase()) ?? null;
    }

    public getLobbies(): any {
        return this.games.map(game => {
            return {
                name: game.name,
                uuid: game.uuid,
                playerCount: game.players.playerCount,
                config: {
                    maxPlayers: game.config.maxPlayers,
                    hasPassword: game.config.password !== '',
                }
            }
        });
    }

    public checkPlayersInGame(): void {
        this.games.forEach(game => {
            game.checkPlayersInGame();
        });
    }

    public checkPlayersAlive(): void {
        this.games.forEach(game => {
            game.checkPlayersAlive();
        });
    }


}


export default Games;