

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