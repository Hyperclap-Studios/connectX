import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Link, useNavigate} from "react-router-dom";
import {coinsState, gameState, inLobbyState, lobbyTokenState, playerState, tokenState} from "../../atoms";
import socket from "../../instances/socket";
import './Game.scss';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';


export default function Game({uuid}: IGameProps) {
    const [game, setGame] = useRecoilState(gameState);
    const [player, setPlayer] = useRecoilState(playerState);
    const [coins, setCoins] = useRecoilState(coinsState);
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
                console.log(response.data);
                setGame(response.data.game);
                setPlayer(response.data.user);

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
            } else console.error(`Request Error: ${e.message}`);
        }
    };

    const toggleReady = () => {
        socket.emit('toggle_ready', {
            gameToken: lobbyToken,
            gameUUID: game.uuid,
        });
    };

    return (
        <>
            <span className={'game_leave'}><Link to={'/'}>Leave</Link></span>
            {
                lobbyToken ? (
                    <div className={'game'}>

                        <h1>{game.name}</h1>
                        <div className={'game_info'}>
                            <div className={'game_info_winner'}>{game.state === 'finished' ? `${game.winner ? game.winner.username : 'No one'} wins!` : ''}</div>
                            <div className={'game_info_turn'}>{player.gameData.hasTurn ? 'Your Turn' : ''}</div>
                            {
                                game.gameMode === 'gravitySwitch' ? (
                                    <div className={'game_info_gravity'}>
                                        <span>Next Gravity:</span>
                                        {
                                            game.gravity.y === 1 ? <FaArrowDown /> : game.gravity.y === -1 ? <FaArrowUp /> : (
                                                game.gravity.x === 1 ? <FaArrowRight /> : game.gravity.x === -1 ? <FaArrowLeft /> : ''
                                            )
                                        }
                                    </div>
                                ) : ''
                            }
                        </div>
                        <GameBoard />
                        <div className={'game_players'}>
                            {
                                game && player ? (
                                    <>
                                        {
                                            game.players.map(_player => (
                                                <div onClick={() => {if (_player.uuid === player.uuid) toggleReady()}} key={_player.uuid} className={`game_player ${game.state !== 'waiting' ? _player.color : ''} ${_player.gameData.hasTurn ? 'hasTurn' : ''} ${_player.gameData.isReady && game.state === 'waiting' ? 'isReady' : ''} ${_player.uuid === player.uuid ? 'isPlayer' : ''}`}>
                                                    <div className={'game_player_name'}>{_player.username}</div>
                                                </div>
                                            ))
                                        }
                                    </>
                                ) : ''
                            }
                        </div>
                    </div>
                ) : <PasswordPrompt join={join} uuid={uuid} />
            }
        </>
    );
}

function Coins() {
    const game = useRecoilValue(gameState);

    const coins = useCallback(() => {
        console.log('COINS');
        const _coins: JSX.Element[] = [];
        game.board.grid.forEach(row => row.forEach(cell => {
            _coins.push(<Coin key={cell.x + '-' + cell.y} x={cell.x} y={cell.y} color={cell.color} connected={cell.connected} />);
        }));
        return _coins;
    }, [game]);

    return (
        <>
            {
                coins()
            }
        </>
    );
}

function GameBoard() {
    const game = useRecoilValue(gameState);

    const grid = () => {
        if (!game) return 'Loading board...';

        const grid = [];
        for (let y = 0; y < game.board.height; y++) {
            let cells = [];

            for (let x = 0; x < game.board.width; x++) {
                cells.push(<Cell x={x} y={y} key={x} />);
            }

            grid.push(<div key={y} className={'game_board_row'}>{cells}</div>);
        }
        return grid;
    };

    return (
        <div className={'game_board'}>
            <Coins />
            <div className={'game_board_grid'}>{grid()}</div>
        </div>
    );
}

function Cell({x, y}: ICellProps) {
    const game = useRecoilValue(gameState);
    const player = useRecoilValue(playerState);
    const [coins, setCoins] = useRecoilState(coinsState);


    const place = () => {
        if (!game) return;

        socket.emit('place_coin', {
            x,
            y,
            gameUUID: game.uuid,
        });
    };

    return (
        <div onClick={place} className={'game_board_cell'} />
    );
}

function Coin({x, y, color, connected}: ICoin) {
    const game = useRecoilValue(gameState);

    return (
        <div style={{
            left: (x / game.board.width) * 100 + '%',
            top: (y / game.board.height) * 100 + '%',
        }} className={`game_board_coin ${connected ? 'connected' : ''} ${color} ${color !== '' ? (game.gameMode === 'gravitySwitch' ? `fallInY${game.gravity.y}X${game.gravity.x}` : 'fallInY0X1') : ''}`} />
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