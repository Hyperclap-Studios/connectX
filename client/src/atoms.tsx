import { atom } from 'recoil';


const modalState  = atom<IModalState>({
    key: 'modalState',
    default: {
        isOpen: false,
        content: '',
        closable: true,
    }
});

const tokenState = atom<string>({
    key: 'tokenState',
    default: localStorage.getItem('token') ?? '',
});

const lobbiesState = atom<ILobby[]>({
    key: 'lobbiesState',
    default: [],
});

export { modalState, tokenState, lobbiesState };