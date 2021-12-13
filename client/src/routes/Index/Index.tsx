import {useRecoilValue} from "recoil";
import {tokenState} from "../../atoms";
import Games from "../../components/Games/Games";
import Login from "../../components/Login/Login";


export default function Index() {
    const token = useRecoilValue(tokenState)

    return (
        <>
            {
                token ? <Games /> : <Login />
            }
        </>
    );
}