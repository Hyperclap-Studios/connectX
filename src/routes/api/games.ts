import {Router} from "express";
import {body, validationResult} from "express-validator";
import Game from "../../classes/Game";
import gamesInstance from '../../instances/games';
import {updateLobbies} from "../../functions/emitters";
import users from "../../instances/users";
import authentication from "../../middleware/express/authentication";


const games = Router();


games.post('/:uuid/join', authentication, async (req, res) => {
    const game = gamesInstance.getGame(req.params.uuid);
    const user = users.getUser(res.locals.user.uuid);
    if (game) console.log(game.verifyJWT(req.body.gameToken));

    if (game && user && (game.verifyJWT(req.body.gameToken) || await game.checkPassword(req.body.password))) {
        game.players.addUser(user);
        user.lastGamePing = Date.now();

        updateLobbies();

        res.json({
            success: true,
            game: game.getClientGame(),
            gameToken: game.getJWT(),
            message: 'Player added to game',
            user,
        });
    } else {
        res.status(400).json({
            success: false,
            error: game ? 'Incorrect password.' : 'Game not found.'
        });
    }
});

games.post('/',
    authentication,
    body('name').isString()
        .isLength({min: 3, max: 16}).withMessage('Name must be between 3 and 16 characters long.')
        .trim().escape(),
    body('password').isString()
        .isLength({max: 64}).withMessage('Password must be less than 64 characters long.'),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({
            success: false,
            errors: errors.mapped(),
            error: errors.array().map(e => e.msg).join(' '),
        });

        if (gamesInstance.getGameByName(req.body.name)) return res.status(400).json({
            success: false,
            error: 'Game with this name already exists.',
            errors: {
                username: {msg: 'Game with this name already exists.'},
            }
        });

        const game = new Game(req.body.name, {
            password: req.body.password,
        })

        gamesInstance.addGame(game);

        const user = users.getUser(res.locals.user.uuid);

        if (user) {
            game.players.addUser(user);
        }

        updateLobbies();

        return res.json({
            success: true,
            game: game.getClientGame(),
            gameToken: game.getJWT(),
        });
    }
);

export default games;