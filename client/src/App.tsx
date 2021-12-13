import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Games from "./components/Games/Games";
import socket from "./instances/socket";
import {useRecoilState, useSetRecoilState} from "recoil";
import {lobbiesState, tokenState} from "./atoms";
import Index from "./routes/Index/Index";
import axios from "axios";

function App() {
    const [token, setToken] = useRecoilState(tokenState);
    const setLobbies = useSetRecoilState(lobbiesState);

    useEffect(() => {
        socket.auth = {
            token,
        };

        socket.on('user_ping', (payload) => {
            if (payload.msg === 'ping') socket.emit('user_ping', {msg: 'pong'});
        });

        socket.on('update_lobbies', (payload: IUpdateLobbiesPayload) => {
           setLobbies(payload.lobbies);
        });

        (async () => {
            if (token) {
                try {
                    const response = await axios.get('/api/ping', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                } catch (e: any) {
                    setToken('');
                    localStorage.setItem('token', '');
                }
            }
        })();
    }, [token]);

    return (
        <div className="App">
            <Routes>
                <Route index element={<Index />} />
            </Routes>
        </div>
    );
}

export default App;
