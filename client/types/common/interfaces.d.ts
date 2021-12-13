

interface IModalState {
    isOpen: boolean,
    content: string | JSX.Element,
    closable: boolean,
}

interface ILobbyConfig {
    maxPlayers: number,
    hasPassword: boolean,
}

interface ILobby {
    name: string,
    uuid: string,
    playerCount: number,
    config: ILobbyConfig,
}

interface IUpdateLobbiesPayload {
    lobbies: ILobby[],
}

interface IGameProps {
    uuid: string,
}

interface IPasswordPromptProps extends IGameProps {
    join: (password: string) => Promise<any>,
}

interface IGame {
    name: string,
    uuid: string,
    board: IBoard,
    players: IUser[],
    gravity: {x: -1 | 0 | 1, y: -1 | 0 | 1},
}

interface IUser {
    username: string,
    uuid: string,
    color: TUserColor,
    gameData: {
        hasTurn: boolean,
    }
}

interface IBoard {
    grid: ICell[][],
    width: number,
    height: number,
}