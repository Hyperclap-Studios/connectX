import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { useNavigate} from "react-router-dom";
import {gameState, inLobbyState, lobbyTokenState, tokenState} from "../../atoms";
import socket from "../../instances/socket";


export default function Game({uuid}: IGameProps) {
    const [game, setGame] = useRecoilState(gameState);
    const [lobbyToken, setLobbyToken] = useRecoilState(lobbyTokenState);
    const [inLobby, setInLobby] = useRecoilState(inLobbyState);
    const token = useRecoilValue(tokenState);
    const navigate = useNavigate();

    useEffect(() => {
        join().then();


    }, []);

    const join = async (password: string = ''): Promise<any> => {
        try {
            const response = await axios.post(`/api/games/${uuid}/join`, {password, gameToken: lobbyToken}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setInLobby(uuid);
                console.log('IN LOBBY');
                setLobbyToken(response.data.gameToken);
                localStorage.setItem('lobbyToken', response.data.gameToken);
                setGame(response.data.game);
                return true;
            } else {
                console.log('RESET LOBBY TOKEN');
                setLobbyToken('');
                localStorage.setItem('lobbyToken', '');
            }
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                setLobbyToken('');
                localStorage.setItem('lobbyToken', '');
                if (e.response?.data.error === 'Game not found.') navigate('/');
                return (e.response?.data.error ?? '');
            } else console.error(e.message);
        }
    };

    return (
        <>
            {
                lobbyToken ? (
                    <div className={'game'}>
                        <h1>{game.name}</h1>
                        <div className={'game_players'}>
                            {
                                game.players.map(player => (
                                    <div key={player.uuid} className={'game_player'}>
                                        <div className={'game_player_name'}>{player.username}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : <PasswordPrompt join={join} uuid={uuid} />
            }
        </>
    );
}

function PasswordPrompt({uuid, join}: IPasswordPromptProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [lobbyToken, setLobbyToken] = useRecoilState(lobbyTokenState);


    const _join = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');

        const response = await join(password);

        if (response !== true) {
            setError(response);
        }
    };

    return (
        <div className={'passwordPrompt'}>
            <h1>Enter Password</h1>
            <form>
                <label>
                    <span>Password</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={'password'} />
                </label>
                <button onClick={_join}>Enter</button>
                <span className={'error'}>{error}</span>
            </form>
        </div>
    );
}