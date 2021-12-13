


interface ICell {
    x: number,
    y: number,
    state: TCellState,
    color: TUserColor,
    connected: boolean,
}

interface IUserGameData {
    hasTurn: boolean,
}

interface IGameConfig {
    boardSize?: {width: number, height: number},
    winLength?: number,
    maxPlayers?: number,
    password?: string,
    powerUps?: boolean,
}

interface IUserPingPayload {
    msg?: 'pong',
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