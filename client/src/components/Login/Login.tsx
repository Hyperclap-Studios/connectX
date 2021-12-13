import React, {useEffect, useRef, useState} from "react";
import {useSetRecoilState} from "recoil";
import {tokenState} from "../../atoms";
import axios, {AxiosError} from "axios";
import './Login.scss';


export default function Login() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const setToken = useSetRecoilState(tokenState);

    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        input.current?.focus();
    }, []);

    const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/users', {username});

            if (response.data.success) {
                console.log(response.data.token);
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
            }
        } catch (e: any | AxiosError) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data.errors.username.msg ?? '');
            } else console.error(e.message);


        }
    };

    return (
        <div className={'login'}>
            <h1>Enter A Username</h1>
            <form>
                <label>
                    <span className={username !== '' ? 'focus' : ''}>Username</span>
                    <input ref={input} value={username} onChange={e => setUsername(e.target.value)} type={'text'} />
                </label>
                <button onClick={login}>Enter</button>
                <span className={'error'}>{error}</span>
            </form>
        </div>
    );
}