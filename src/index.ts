import {config} from 'dotenv';
import users from "./instances/users";
import {server} from './instances/server';
import {pingUsers} from "./functions/emitters";


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

    users.checkAlive();
}, 1000);