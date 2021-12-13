import {Router} from "express";
import {body, validationResult} from "express-validator";
import Game from "../../classes/Game";
import gamesInstance from '../../instances/games';


const games = Router();


games.post('/',
    body('name').isString()
        .isLength({min: 3, max: 16}).withMessage('Name must be between 3 and 16 characters long.')
        .trim().escape(),
    body('password').isString()
        .isLength({max: 64}).withMessage('Password must be less than 64 characters long.'),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.json({
            success: false,
            errors: errors.mapped(),
        });

        const game = new Game(req.body.name, {
            password: req.body.password,
        })

        gamesInstance.addGame(game);

        return res.json({
            success: true,
            game,
        });
    }
);