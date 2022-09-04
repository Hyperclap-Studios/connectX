import { Router } from "express";
import { body, validationResult } from "express-validator";
import Game from "../../classes/Game";
import gamesInstance from "../../instances/games";
import { updateGame, updateLobbies } from "../../functions/emitters";
import users from "../../instances/users";
import authentication from "../../middleware/express/authentication";

const games = Router();

games.post("/:uuid/join", authentication, async (req, res) => {
	const game = gamesInstance.getGame(req.params.uuid);
	const user = users.getUser(res.locals.user.uuid);
	if (game) console.log(game.verifyJWT(req.body.gameToken));

	if (
		game &&
		user &&
		(game.verifyJWT(req.body.gameToken) ||
			(await game.checkPassword(req.body.password)))
	) {
		gamesInstance.games.forEach((_game) => {
			if (game.uuid !== _game.uuid) {
				_game.players.users.forEach((_user) => {
					_game.removeUser(user);
				});
				updateGame(_game);
			}
		});

		if (!game.players.getUser(user.uuid)) {
			game.players.addUser(user);
			user.gameData.hasTurn = false;
		}

		user.lastGamePing = Date.now();
		user.gameData.isReady = false;

		updateLobbies();

		updateGame(game);

		return res.json({
			success: true,
			game: game.getClientGame(),
			gameToken: game.getJWT(),
			message: "Player added to game",
			user: user.getClientUser(),
		});
	} else {
		return res.status(400).json({
			success: false,
			error: game ? "Incorrect password." : "Game not found.",
		});
	}
});

games.post(
	"/",
	authentication,
	body("name")
		.isString()
		.isLength({ min: 3, max: 16 })
		.withMessage("Name must be between 3 and 16 characters long.")
		.trim()
		.escape()
		.replace(" ", "-"),
	body("password")
		.isString()
		.isLength({ max: 64 })
		.withMessage("Password must be less than 64 characters long."),
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.status(400).json({
				success: false,
				errors: errors.mapped(),
				error: errors
					.array()
					.map((e) => e.msg)
					.join(" "),
			});

		if (
			req.body.winLength > req.body.width ||
			req.body.winLength > req.body.height
		) {
			return res.status(400).json({
				success: false,
				error: "Win length must be less than the board size.",
			});
		}

		if (
			req.body.width < req.body.winLength &&
			req.body.height < req.body.winLength
		) {
			return res.status(400).json({
				success: false,
				error: "Win length must be longer than or equal as width or height.",
			});
		}

		if (
			req.body.gameMode !== "classic" &&
			req.body.gameMode !== "gravitySwitch"
		) {
			return res.status(400).json({
				success: false,
				error: "Invalid game mode.",
			});
		}

		if (gamesInstance.getGameByName(req.body.name))
			return res.status(400).json({
				success: false,
				error: "Game with this name already exists.",
				errors: {
					username: { msg: "Game with this name already exists." },
				},
			});

		const game = new Game(req.body.name, {
			password: req.body.password,
			winLength: req.body.winLength,
			boardSize: { width: req.body.width, height: req.body.height },
			gameMode: req.body.gameMode,
		});

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
