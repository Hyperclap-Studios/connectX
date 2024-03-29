import React, { useEffect } from "react";
import "./App.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import socket from "./instances/socket";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	gameState,
	inLobbyState,
	lobbiesState,
	playerState,
	tokenState,
} from "./atoms";
import Index from "./routes/Index/Index";
import axios from "axios";
import Modal from "./components/Modal/Modal";
import Game from "./components/Game/Game";

function App() {
	const [token, setToken] = useRecoilState(tokenState);
	const [lobbies, setLobbies] = useRecoilState(lobbiesState);
	const inLobby = useRecoilValue(inLobbyState);
	const setGame = useSetRecoilState(gameState);
	const setPlayer = useSetRecoilState(playerState);

	useEffect(() => {
		socket.auth = {
			token,
		};

		socket.on("user_ping", (payload) => {
			if (payload.msg === "ping")
				socket.emit("user_ping", { msg: "pong" });
		});

		socket.on("update_lobbies", (payload: IUpdateLobbiesPayload) => {
			setLobbies(payload.lobbies);
		});

		(async () => {
			if (token) {
				try {
					const response = await axios.get("/api/ping", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
				} catch (e: any) {
					setToken("");
					localStorage.setItem("token", "");
				}
			}
		})();
	}, [token]);

	useEffect(() => {
		socket.off("game_ping").on("game_ping", (payload) => {
			if (inLobby !== null) {
				//console.log(inLobby);
				//console.log('EMIT GAME_PING');
				socket.emit("game_ping", {
					uuid: inLobby,
				});
			}
		});

		socket.off("update_game").on("update_game", (payload) => {
			//console.log('UPDATE_GAME');
			//console.log(payload);
			if (inLobby === payload.game.uuid) {
				setGame(payload.game);
				setPlayer(payload.user);
			}
		});
	}, [inLobby]);

	return (
		<div className="App">
			<Routes>
				<Route index element={<Index />} />
				{lobbies.map((lobby) => (
					<Route
						key={lobby.uuid}
						path={`/lobby/${lobby.name.toLowerCase()}`}
						element={<Game uuid={lobby.uuid} />}
					/>
				))}
				{lobbies.length === 0 ? (
					<Route path={"*"} element={<Navigate to={"/"} />} />
				) : (
					""
				)}
			</Routes>
			<Modal />
		</div>
	);
}

export default App;
