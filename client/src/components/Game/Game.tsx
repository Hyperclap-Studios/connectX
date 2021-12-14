import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { useNavigate} from "react-router-dom";
import {coinsState, gameState, inLobbyState, lobbyTokenState, tokenState} from "../../atoms";
import socket from "../../instances/socket";
import './Game.scss';


export default function Game({uuid}: IGameProps) {
    const [game, setGame] = useRecoilState(gameState);
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
                console.log(response.data.game);
                setGame(response.data.game);

                // Fill Coins
                let _coins: ICoin[] = [];
                response.data.game.board.grid.forEach((row: ICell[]) => row.forEach((cell: ICell) => {
                    coins.push({
                        x: cell.x,
                        y: cell.y,
                        velocity: {x: 0, y: 0},
                        color: cell.color,
                        locked: true,
                    });
                }));
                setCoins(_coins);

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
                        <GameBoard />
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

function Coins() {
    const game = useRecoilValue(gameState);
    const [coins, setCoins] = useRecoilState(coinsState);
    const [lastTime, setLastTime] = useState(Date.now());
    const [started, setStarted] = useState(false);

    const velocityMultiplier = 0.01;
    const gravityMultiplier = 0.01;

    const frame = useCallback(() => {
        const nowTime = Date.now();
        const delta = nowTime - lastTime;
        setLastTime(nowTime);

        let _coins = [...coins];

        for (let i = 0; i < _coins.length; i++) {
            const coin = _coins[i];

            if (!coin.locked && coin.x >= 0 && coin.x < game.board.width - 1 && coin.y >= 0 && coin.y < game.board.height - 1) {
                coin.velocity.x += delta * gravityMultiplier;
                coin.velocity.y += delta * gravityMultiplier;

                coin.x += coin.velocity.x * delta * velocityMultiplier;
                coin.y += coin.velocity.y * delta * velocityMultiplier;
            }
        }

        setCoins(_coins);

        requestAnimationFrame(frame);
    }, [coins]);

    useEffect(() => {
        if (coins.length > 0 && !started) {
            setStarted(true);
            requestAnimationFrame(frame);
        }
    }, [coins])

    return (
        coins.map((coin, i) => (
            <Coin key={i} x={coin.x} y={coin.y} velocity={coin.velocity} color={coin.color} locked={coin.locked}  />
        ))
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
            {grid()}
        </div>
    );
}

function Cell({x, y}: ICellProps) {
    return (
        <div className={'game_board_cell'} />
    );
}

function Coin({x, y, color, velocity, locked}: ICoin) {
    const game = useRecoilValue(gameState);

    return (
        <div style={{
            left: (x / game.board.width) * 100 + '%',
            top: (y / game.board.height) * 100 + '%',
        }} className={'game_board_coin ' + color} />
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