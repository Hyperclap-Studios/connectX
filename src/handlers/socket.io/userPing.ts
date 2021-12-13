import users from "../../instances/users";
import {Socket} from "socket.io";


function userPingHandler(this: Socket, payload: IUserPingPayload) {
    if (payload.msg === 'pong') {
        const user = users.getUser(this.data.user.uuid);
        if (user) user.lastPing = Date.now();
    }
}


export default userPingHandler;