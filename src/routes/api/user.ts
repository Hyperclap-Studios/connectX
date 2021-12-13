import {Router} from "express";
import {sign} from "jsonwebtoken";
import User from "../../classes/User";
import { body, validationResult } from 'express-validator';


const user = Router();


user.post('/',

    body('username')
        .isLength({min: 3, max: 16}).withMessage('Username must be between 3 and 16 characters long.')
        .trim().escape(),

    (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,
            errors: errors.mapped(),

        });

    }

    if (process.env.JWT_SECRET) {

        const user = new User(req.body.username);

        const token = sign({

            username: user.username,
            uuid: user.uuid,
            lastPing: user.lastPing,

        }, process.env.JWT_SECRET);

        return res.json({

            success: true,
            token,

        });

    } else {

        return res.json({

            success: false,
            error: 'JWT_SECRET not set.',

        });

    }

});

export default user;