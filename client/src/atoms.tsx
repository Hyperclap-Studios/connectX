import { atom } from 'recoil';


const modalState  = atom<IModalState>({
    key: 'modalState',
    default: {
        isOpen: false,
        content: '',
        closable: true,
    }
});

const gameState = atom<IGame>({
    key: 'gameState',
    default: {
        name: '',
        uuid: '',
        board: {
            grid: [],
            width: 0,
            height: 0,
        },
        players: [],
        gravity: {x: 0, y: 0},
        state: 'waiting',
        winner: null,
        gameMode: 'classic',
    }
});

const tokenState = atom<string>({
    key: 'tokenState',
    default: localStorage.getItem('token') ?? '',
});

const lobbyTokenState = atom<string>({
    key: 'lobbyTokenState',
    default: localStorage.getItem('lobbyToken') ?? '',
});

const lobbiesState = atom<ILobby[]>({
    key: 'lobbiesState',
    default: [],
});

const inLobbyState = atom<string | null>({
    key: 'inLobbyState',
    default: null,
});

const coinsState = atom<ICoin[]>({
    key: 'coinsState',
    default: [],
});

const playerState = atom<IUser>({
    key: 'playerState',
    default: {
        color: '',
        gameData: { hasTurn: false, isReady: false },
        username: '',
        uuid: '',
    }
});

const premoveState = atom<any>({
    key: 'premoveState',
    default: null,
});

export { modalState, tokenState, lobbiesState, lobbyTokenState, gameState, inLobbyState, coinsState, playerState, premoveState };