import {config} from 'dotenv';
import users from "./instances/users";
import {server} from './instances/server';
import {pingGameUsers, pingUsers, updateLobbies} from "./functions/emitters";
import games from "./instances/games";


// Load Environment Variables
config();


// Variables
const PORT = process.env.PORT || 8080;


// Listen
server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}.`);
});


// Check Lifecycles
setInterval(() => {
    pingUsers();
    pingGameUsers();

    users.checkAlive();
    games.checkPlayersInGame();

    updateLobbies();
}, 1000);