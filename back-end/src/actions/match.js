import { db } from "../database.js";

export const debugCreaMatch = (req, res) => {
	if (process.env.DEBUG)
		console.log('\ndebugCreaMatch')

	const {
		id_winner,
		id_player_1,
		id_player_2,
		score_player_1,
		score_player_2,
		duration,
		bounces,
		max_speed} = req.body

	registerMatch({
		id_winner: id_winner,
		id_player_1: id_player_1,
		id_player_2: id_player_2,
		score_player_1: score_player_1,
		score_player_2: score_player_2,
		duration: duration,
		bounces: bounces,
		max_speed: max_speed})

	res.send('game saved')
}

export const debugCreaSpecialMatch = (req, res) => {
	if (process.env.DEBUG)
		console.log('\ndebugCreaSpecialMatch')

	const {
		id_winner,
		id_player_1,
		id_player_2,
		id_player_3,
		id_player_4,
		score_player_1,
		score_player_2,
		score_player_3,
		score_player_4,
		duration,
		bounces,
		max_speed} = req.body

	registerSpecialMatch({
		id_winner: id_winner,
		id_player_1: id_player_1,
		id_player_2: id_player_2,
		id_player_3: id_player_3,
		id_player_4: id_player_4,
		score_player_1: score_player_1,
		score_player_2: score_player_2,
		score_player_3: score_player_3,
		score_player_4: score_player_4,
		duration: duration,
		bounces: bounces,
		max_speed: max_speed})

	res.send('special game saved')
}

/**
 * Create a new element in games_2 table
 * @param {{id_winner: number,
 * 			id_player_1: number,
 * 			id_player_2: number,
 * 			score_player_1: number,
 * 			score_player_2: number,
 * 			duration: number,
 * 			bounces: number,
 * 			max_speed: number}} data
 */
export const registerMatch = (data) => {
	if (process.env.DEBUG)
		console.log('\nregisterMatch')

	// Insertion of new game
	db.prepare('INSERT INTO games_2 ( \
		id_winner, \
		id_player_1, \
		id_player_2, \
		score_player_1, \
		score_player_2, \
		duration, \
		bounces, \
		max_speed) \
		VALUES \
		(?, ?, ?, ?, ?, ?, ?, ?);')
		.run(data.id_winner,
			data.id_player_1,
			data.id_player_2,
			data.score_player_1,
			data.score_player_2,
			data.duration,
			data.bounces,
			data.max_speed
		)
}

/**
 * Create a new element in games_4 table
 * @param {{id_winner: number,
 * 			id_player_1: number,
 * 			id_player_2: number,
 * 			id_player_3: number,
 * 			id_player_4: number,
 * 			score_player_1: number,
 * 			score_player_2: number,
 * 			score_player_3: number,
 * 			score_player_4: number,
 * 			duration: number,
 * 			bounces: number,
 * 			max_speed: number}} data
 */
export const registerSpecialMatch = (data) => {
	if (process.env.DEBUG)
		console.log('\nregisterSpecialMatch')

	// Insertion of new game
	db.prepare('INSERT INTO games_4 ( \
		id_winner, \
		id_player_1, \
		id_player_2, \
		id_player_3, \
		id_player_4, \
		score_player_1, \
		score_player_2, \
		score_player_3, \
		score_player_4, \
		duration, \
		bounces, \
		max_speed) \
		VALUES \
		(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?);')
		.run(data.id_winner,
			data.id_player_1,
			data.id_player_2,
			data.id_player_3,
			data.id_player_4,
			data.score_player_1,
			data.score_player_2,
			data.score_player_3,
			data.score_player_4,
			data.duration,
			data.bounces,
			data.max_speed
		)
}

/**
 * Create a new element in tournament table
 * @param {{username_player_1: string,
 * 			username_player_2: string,
 * 			username_player_3: string,
 * 			username_player_4: string,
 * 			username_winner_1: string,
 * 			username_winner_2: string,
 * 			username_winner_3: string}} data
 */
export const registerTournament = (data) => {
	if (process.env.DEBUG)
		console.log('\nregisterTournament')
	// Insertion of tournament
	db.prepare('INSERT INTO tournament ( \
		username_player_1, \
		username_player_2, \
		username_player_3, \
		username_player_4, \
		username_winner_1, \
		username_winner_2, \
		username_winner_3) \
		VALUES \
		(?, ?, ?, ?, ?, ?, ?);')
		.run(data.username_player_1,
			data.username_player_2,
			data.username_player_3,
			data.username_player_4,
			data.username_winner_1,
			data.username_winner_2,
			data.username_winner_3
		)
}

/**
 * Returns a list of game informations and win/loss data
 * @param {Request} req
 * @param {Reply} res
 * @return {{nb_win: number,
 * 			nb_loss: number,
 * 			winrate: float,
 * 			games:[{match_id: number,
 * 					opponent_username: string,
 * 					date: timestamp,
 * 					status: string}]
 * 			}}
 */
export const getHistory = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetHistory')

	let user_token = {}

	// get user data from token
	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// get match list from table game_2
	const game_list = db.prepare('SELECT * FROM games_2 WHERE (id_player_1 = ? OR id_player_2 = ?);')
						.all(user_token.userid, user_token.userid)

	let history_list = []
	let nb_win = 0
	let nb_loss = 0

	for (const game of game_list) {

		let opponent_id = (game.id_player_1 === user_token.userid) ? game.id_player_2 : game.id_player_1
		let opponent_username

		// opponent is guest
		if (opponent_id === -1) {
			opponent_username = 'invité'
		} else {
			// recup opponent username
			const opponent = db.prepare('SELECT username FROM users WHERE id = ?;').get(opponent_id)
			if (opponent === undefined) {
				res.statusCode = 500
				res.send('internal server error')
			}
			opponent_username = opponent.username
		}

		let state

		// check if win or loose
		if (user_token.userid === game.id_winner) {
			state = "win"
			nb_win++
		} else {
			state = "loss"
			nb_loss++
		}

		const history_data = {
			id: game.id,
			opponent_username: opponent_username,
			date: game.date.substr(0, 10),
			status: state
		}

		history_list.push(history_data)
	}

	const history = {
		nb_win: nb_win,
		nb_loss: nb_loss,
		winrate: (nb_win / (nb_loss + nb_win) * 100),
		games: history_list
	}

	// retourner les donnees
	res.send(history)
}

/**
 * Returns a list of special game informations and win/loss data
 * @param {Request} req
 * @param {Reply} res
 * @return {{nb_win: number,
 * 			nb_loss: number,
 * 			winrate: float,
 * 			games:[{match_id: number,
 * 					opponent_1_username: string,
 * 					opponent_2_username: string,
 * 					opponent_3_username: string,
 * 					date: timestamp,
 * 					status: string}]
 * 			}}
 */
export const getSpecialHistory = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetSpecialHistory')

	let user_token = {}

	// get user data from token
	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// get match list from table game_4
	const game_list = db.prepare('SELECT * FROM games_4 WHERE (id_player_1 = ? OR id_player_2 = ? OR id_player_3 = ? OR id_player_4 = ?);')
						.all(user_token.userid, user_token.userid, user_token.userid, user_token.userid)

	let history_list = []
	let nb_win = 0
	let nb_loss = 0

	for (const game of game_list) {

		// find opponents id
		let opponents_id = []

		if (game.id_player_1 !== user_token.userid)
			opponents_id.push(game.id_player_1)
		if (game.id_player_2 !== user_token.userid)
			opponents_id.push(game.id_player_2)
		if (game.id_player_3 !== user_token.userid)
			opponents_id.push(game.id_player_3)
		if (game.id_player_4 !== user_token.userid)
			opponents_id.push(game.id_player_4)

		let opponents_name = []

		// get opponents name
		for (let i = 0; i < 3; i++) {
			const opponent_name = db.prepare('SELECT username FROM users WHERE id = ?;').get(opponents_id[i])
			if (opponent_name === undefined) {
				res.statusCode = 500
				res.send('internal server error')
			}
			opponents_name.push(opponent_name.username)
		}

		// check win / loss
		let state
		if (user_token.userid === game.id_winner) {
			state = "win"
			nb_win++
		} else if (game.id_winner === -1) {
			state = "draw"
		} else {
			state = "loss"
			nb_loss++
		}

		const history_data = {
			id: game.id,
			opponent_1_username: opponents_name[0],
			opponent_2_username: opponents_name[1],
			opponent_3_username: opponents_name[2],
			date: game.date.substr(0, 10),
			status: state
		}

		history_list.push(history_data)
	}

	const history = {
		nb_win: nb_win,
		nb_loss: nb_loss,
		winrate: (nb_win / (nb_loss + nb_win) * 100),
		games: history_list
	}

	// retourner les donnees
	res.send(history)
}

/**
 * Returns the game data of the given id in param
 * @param {Request} req
 * @param {Reply} res
 * @return {{data :{match_id: number,
 * 			player_1_username: string,
 * 			player_2_username: string,
 * 			player_1_score: number,
 * 			player_2_score: number,
 * 			date: timestamp,
 * 			duration: number,
 * 			bounces: number,
 * 			max_speed: number,
 * 			status: string
 * 			}}}
 */
export const getMatchData = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetMatchData')

	let user_token = {}
	let data = {}

	// get user data from token
	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// recup match id depuis le param
	const match_id = req.params.id
	if (match_id === undefined) {
		res.statusCode = 400
		res.send('no parameter id')
	}

	// recup les donnees de la game dans la table games_2
	const match_data = db.prepare('SELECT * FROM games_2 WHERE id = ?;').get(match_id)
	if (match_data === undefined) {
		res.statusCode = 404
		res.send('match not found')
	}

	// match id
	data.match_id = match_data.id

	// username joueurs
	const player_1 = db.prepare('SELECT username FROM users WHERE id = ?;')
								.get(match_data.id_player_1)
	if (player_1 === undefined) {
		res.statusCode = 500
		res.send('internal server error')
	}
	data.player_1_username = player_1.username

	if (match_data.id_player_2 === -1) {
		data.player_2_username = 'invité'
	} else {
		const player_2 = db.prepare('SELECT username FROM users WHERE id = ?;')
									.get(match_data.id_player_2)
		if (player_2 === undefined) {
			res.statusCode = 500
			res.send('internal server error')
		}
		data.player_2_username = player_2.username
	}

	// scores
	data.player_1_score = match_data.score_player_1
	data.player_2_score = match_data.score_player_2

	// date + duration
	data.date = match_data.date.substr(0, 10)
	data.duration = match_data.duration

	// max speed + bounces
	data.max_speed = match_data.max_speed
	data.bounces = match_data.bounces

	// win / loss
	data.status = (user_token.userid === match_data.id_winner) ? "win" : "loss"

	res.send(data)
}

/**
 * Returns the game data of the given id in param
 * @param {Request} req
 * @param {Reply} res
 * @return {{data :{match_id: number,
 * 			player_1_username: string,
 * 			player_2_username: string,
 * 			player_3_username: string,
 * 			player_4_username: string,
 * 			player_1_score: number,
 * 			player_2_score: number,
 * 			player_3_score: number,
 * 			player_4_score: number,
 * 			date: timestamp,
 * 			duration: number,
 * 			bounces: number,
 * 			max_speed: number,
 * 			status: string
 * 			}}}
 */
export const getSpecialMatchData = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetSpecialMatchData')

	let data = {}
	let user_token = {}

	// get user data from token
	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}
	// get match_id
	data.match_id = req.params.id
	if (data === undefined || data.match_id === undefined) {
		res.statusCode = 400
		res.send('no parameter id')
	}

	// get match data
	const match_data = db.prepare('SELECT * FROM games_4 WHERE id = ?;').get(data.match_id)
	if (match_data === undefined)
		res.code(500).send('internal server error')

	// get usernames
	const player_1_username = db.prepare('SELECT username FROM users WHERE id = ?;').get(match_data.id_player_1)
	const player_2_username = db.prepare('SELECT username FROM users WHERE id = ?;').get(match_data.id_player_2)
	const player_3_username = db.prepare('SELECT username FROM users WHERE id = ?;').get(match_data.id_player_3)
	const player_4_username = db.prepare('SELECT username FROM users WHERE id = ?;').get(match_data.id_player_4)

	if (player_1_username === undefined ||
		player_2_username === undefined ||
		player_3_username === undefined ||
		player_4_username === undefined)
		res.code(500).send('internal server error')

	let player_1 = {}, player_2 = {}, player_3 = {}, player_4 = {}

	player_1.username = player_1_username.username
	player_2.username = player_2_username.username
	player_3.username = player_3_username.username
	player_4.username = player_4_username.username

	// scores
	player_1.score = match_data.score_player_1
	player_2.score = match_data.score_player_2
	player_3.score = match_data.score_player_3
	player_4.score = match_data.score_player_4

	data.player_1 = player_1
	data.player_2 = player_2
	data.player_3 = player_3
	data.player_4 = player_4

// date + duration
	data.date = match_data.date.substr(0, 10)
	data.duration = match_data.duration

// bounces + max_speed
	data.bounces = match_data.bounces
	data.max_speed = match_data.max_speed

// status
	if (user_token.userid === match_data.id_winner)
		data.status = "win"
	else if (match_data.id_winner === -1)
		data.status = "draw"
	else
		data.status = "loss"

	res.send(data)
}