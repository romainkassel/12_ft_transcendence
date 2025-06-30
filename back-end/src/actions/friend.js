import { db } from "../database.js"
import { clients } from "../server.js"

/**
 * Gets user_id from token, if token issue return 401.
 * Returns an array of friends informations
 * @param {Request} req
 * @param {Reply} res
 * @returns {[{id: number, username: string, avatar_path: string, connected: boolean}]}
 */
export const getFriends = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetFriends')

	let token = {}

	// Get current user
	try {
		token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	let friendlist = []

	// Get the list of friends id
	const friends = db.prepare('SELECT * FROM friends WHERE id_user = ?;').all(token.userid)

	// For every id, get the user data and add it to the array
	for (const friend_id of friends) {
		const friend = db.prepare('SELECT * FROM users WHERE id = ?;').get(friend_id.id_friend)
		let curr_friend = {id: friend.id, username: friend.username, avatar_path: friend.avatar_path, connected: false}
		for (const client of clients) {
			if (client.username === curr_friend.username) {
				curr_friend.connected = true
			}
		}
		friendlist.push(curr_friend)
	}

	res.send(friendlist)
}

/**
 * Gets user_id from token, if token issue return 401 and friend_username in request body.
 * Checks if friend_username corresponds to a known user, if not returns 404.
 * Checks if user already has user in his friends, if not add him and
 * returns 200 else returns 400
 * @param {Request} req
 * @param {Reply} res
 */
export const addFriend = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\naddFriend')

	let token = {}

	// Get current user
	try {
		token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// Get friend username
	const {friend_username} = req.body
	if (friend_username === undefined) { // no params
		res.code(400)
		res.send('no parameters')
		return
	}

	// Control if user try to add himself
	if (friend_username === token.username) {
		res.code(400)
		res.send('try to add himself')
		return
	}

	// Look for friend in users with username
	const friend = db.prepare('SELECT * FROM users WHERE username = ?;').get(friend_username)
	if (friend === undefined) { // Unknown username
		res.statusCode = 404
		res.send('user not found')
		return
	}

	// Look in the friends tables
	const is_friend = db.prepare('SELECT * FROM friends WHERE id_user = ? AND id_friend = ?;').get(token.userid, friend.id)
	if (is_friend === undefined) { // not friend yet
		db.prepare('INSERT INTO friends (id_user, id_friend) VALUES (?, ?);').run(token.userid, friend.id)
		res.send('friend added')
	} else { // already friend
		res.statusCode = 400
		res.send('already friend')
	}
}

/**
 * Gets user_id from jwt, if token issue return 401 and friend_id in request body.
 * Try to remove friendship in friends table, if wasn't friend returns 400, else 200
 * @param {Request} req
 * @param {Reply} res
 */
export const removeFriend = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nremoveFriend')

	let token = {}

	// Get current user
	try {
		token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// Get friend username
	const {friend_id} = req.body
	if (friend_id === undefined) { // no params
		res.statusCode = 400
		res.send('no parameters')
		return
	}

	// Delete friend, check changes to know if user was friend
	const remove = db.prepare('DELETE FROM friends WHERE id_user = ? AND id_friend = ?;').run(token.userid, friend_id)

	if (remove.changes === 0) { // Not friend
		res.statusCode = 400
		res.send('not friend')
		return
	}
	res.send('friend removed')
}
