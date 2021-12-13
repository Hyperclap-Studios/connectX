import {Router} from "express";
import authentication from "../../middleware/express/authentication";


const ping = Router();


ping.get('/', authentication, (_req, res) => {
    res.json({
        success: true,
        msg: 'pong',
    });
});


export default ping;