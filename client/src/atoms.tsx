import { atom } from 'recoil';


const modalState  = atom<IModalState>({
    key: 'modalState',
    default: {
        isOpen: false,
        content: '',
        closable: true,
    }
});

export { modalState };