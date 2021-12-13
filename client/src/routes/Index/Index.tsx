import {useRecoilValue, useSetRecoilState} from "recoil";
import {inLobbyState, tokenState} from "../../atoms";
import Games from "../../components/Games/Games";
import Login from "../../components/Login/Login";
import {useEffect} from "react";


export default function Index() {
    const token = useRecoilValue(tokenState)
    const setInLobby = useSetRecoilState(inLobbyState);

    useEffect(() => {
        setInLobby(null);
        console.log('NOT IN LOBBY');
    }, [])

    return (
        <>
            {
                token ? <Games /> : <Login />
            }
        </>
    );
}