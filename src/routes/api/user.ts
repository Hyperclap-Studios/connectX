import {Router} from "express";
import {sign} from "jsonwebtoken";
import User from "../../classes/User";



const user = Router();


user.post('/', (req, res) => {
    if (process.env.JWT_SECRET) {
        const user = new User(req.body.username);

        const token = sign({
            username: user.username,
            uuid: user.uuid,
            lastPing: user.lastPing,
        }, process.env.JWT_SECRET);

        res.json({
            success: true,
            token,
        });
    }
});

export default user;