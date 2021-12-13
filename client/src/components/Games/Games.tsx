import './Games.scss';
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {lobbiesState, lobbyTokenState, modalState, tokenState} from "../../atoms";

export default function Games() {
    const [modal, setModal] = useRecoilState(modalState);
    const lobbies = useRecoilValue(lobbiesState);

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('sheesh');
        setModal({
            ...modal,
            isOpen: true,
            content: <CreateLobby />,
        });
    };

    return (
        <div className={'games'}>
            <h1>Lobbies</h1>
            <button onClick={openModal}>Create New Lobby</button>
            {
                lobbies.map(lobby => (
                    <Link to={`/lobby/${lobby.name.toLowerCase()}`} key={lobby.uuid} className={'games_game'}>
                        <span className={'games_game_name'}>{lobby.name}</span>
                        <span className={'games_game_playerCount'}>{lobby.playerCount} / {lobby.config.maxPlayers}</span>
                    </Link>
                ))
            }
        </div>
    );
}

function CreateLobby() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const token = useRecoilValue(tokenState);
    const setLobbyToken = useSetRecoilState(lobbyTokenState);
    const [modal, setModal] = useRecoilState(modalState);

    const navigate = useNavigate();

    const createLobby = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/games', {
                name,
                password,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.data.success) {
                console.log(response.data);
                setLobbyToken(response.data.gameToken);
                localStorage.setItem('lobbyToken', response.data.gameToken);
                setName('');
                setPassword('');
                setModal({
                    ...modal,
                    isOpen: false,
                });
                navigate(`/lobby/${response.data.game.name}`);
            }
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data.error ?? '');
            } else {
                console.error(e.message);
            }
        }
    };

    const inputElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputElement !== null && modal.isOpen) {
            inputElement.current?.focus();
        }
    }, [modal.isOpen]);

    return (
        <>
            <h3>Create Lobby</h3>
            <form>
                <label>
                    <span className={name === '' ? '' : 'focus'}>Name</span>
                    <input ref={inputElement} value={name} onChange={e => setName(e.target.value)} type={'text'} />
                </label>
                <label>
                    <span className={password === '' ? '' : 'focus'}>Password</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={'password'} />
                </label>
                <button onClick={e => createLobby(e)}>Create</button>
                <span className={'error'}>{error}</span>
            </form>
        </>
    );
}