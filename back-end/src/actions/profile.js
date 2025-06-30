import { db } from "../database.js";
import bcrypt from "bcryptjs";
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

/**
 * Returns the current user profile data
 * @param {Request} req
 * @param {Reply} res
 * @returns {{avatar_path: string, username: string, mail: string}}
 */
export const getProfile = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetProfile')

	let user_token = {}

	// get user data
	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// Get current user data
	const user = db.prepare('SELECT * FROM users WHERE id = ?;').get(user_token.userid)

	// User not found
	if (user === undefined) {
		res.statusCode = 500
		res.send('error while loading user data')
	}

	// Get only wanted data
	const profile = {
		avatar_path: user.avatar_path,
		username: user.username,
		mail: user.mail,
		fa2_enabled: user.fa2_enabled
	}
	res.send(profile)
}

/**
 * Returns the given user id profile data
 * @param {Request} req
 * @param {Reply} res
 * @returns {{avatar_path: string, username: string, mail: string, fa2_enabled: boolean}}
 */
export const getProfileID = (req, res) => {
	if (process.env.DEBUG)
		console.log('\ngetProfileID')

	// Get user profile's requested id
	const user_id = req.params.id
	if (user_id === undefined) {
		res.statusCode = 400
		res.send('no parameter: id')
	}

	// Get user data
	const user = db.prepare('SELECT * FROM users WHERE id = ?;').get(user_id)

	// user not found
	if (user === undefined) {
		res.statusCode = 404
		res.send('invalid user id')
	}

	const profile = {
		avatar_path: user.avatar_path,
		username: user.username,
		mail: user.mail
	}
	res.send(profile)
}

/**
 * Replace current password with new one in users table
 * @param {Request} req
 * @param {Reply} res
 */
export const updatePassword = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nupdatePassword')

	const {password} = req.body

	// get user data
	let user_token = {}

	try {
		user_token = await req.jwtVerify();
	} catch (err) {
		console.error(err);
		res.code(401).send({ error: 'unauthorized: invalid or expired token' });
	}

	// encrypt password
	const hashed_password = bcrypt.hashSync(password, 10)

	// update password in table
	db.prepare('UPDATE users SET password = ? WHERE id = ?;').run(hashed_password, user_token.userid)

	res.code(201).send()
}

/**
 * Returns avatar path of the given user (user id un param)
 * @param {Request} req
 * @param {Reply} res
 */
export const getAvatar = async (req, res) => {
	// if (process.env.DEBUG)
	// 	console.log('\ngetAvatar')

	const user_id = req.params.id

	if (user_id === undefined)
		res.code(400).send('no parameter: id')

	const avatar_path = db.prepare('SELECT avatar_path FROM users WHERE id = ?;').get(user_id)

	return(avatar_path)
}

/**
 * Save the sent avatar in local and replace current avatar path with new one in users table
 * @param {Request} req
 * @param {Reply} res
 */
export const updateAvatar = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nupdateAvatar')

	try {
		const data = await req.file();
		if (!data || !data.filename)
			return res.code(400).send({ error: 'Aucun fichier reçu' })

		// recup donnees utilisateur actuel
		const user_token = await req.jwtVerify()

		// creation du path
		const ext = path.extname(data.filename)
		const filename = `avatar_${user_token.userid}_${Date.now()}${ext}`
		const avatar_path = path.join(process.cwd(), 'avatars', filename)

		// ecriture de l'avatar depuis le fichier envoye
		await pipeline(data.file, fs.createWriteStream(avatar_path))

		// remove avatar
		const old_avatar_path = db.prepare('SELECT avatar_path FROM users WHERE id = ?;').get(user_token.userid)
		// console.log(old_avatar_path)
		if (old_avatar_path.avatar_path != null && old_avatar_path.avatar_path != undefined)
		{
			fs.rm(old_avatar_path.avatar_path, (err) => {
			if(err){
				return;
			}
			// console.log("Avatar deleted successfully");
		})
		}

		// Update avatar path dans la base
		db.prepare('UPDATE users SET avatar_path = ? WHERE id = ?;').run(avatar_path, user_token.userid)

		return res.code(201).send()

	} catch (err) {
		console.error(err)
		res.code(500).send('Error during avatar update')
	}
};
