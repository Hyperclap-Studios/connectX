import { Socket } from 'socket.io';
import games from "../../instances/games";


const connectionHandler = (socket: Socket) => {
    console.log('Client connected.');

    socket.on('disconnect', () => {

        console.log('Client disconnected.');

    });

    socket.emit('update_games', games);
}

export default connectionHandler;