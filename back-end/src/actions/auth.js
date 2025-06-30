import { db } from "../database.js";
import bcrypt from "bcryptjs";
import {server} from "../server.js"
import { clients } from "../server.js";
import speakeasy from 'speakeasy'
import nodemailer from 'nodemailer'

export const loginAction = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nloginAction')

	const { password, username } = req.body

	/*if (clients.findIndex((client) => client.username === username) >= 0)
		return res.code(401).send('can\'t log')*/

	try {
		const user = db.prepare('SELECT * FROM users WHERE username = ?;').get(username)
		if (!user)
			return res.code(404).send({ error: 'wrong credentials' })
		const valid = await bcrypt.compare(password, user.password)
		if (!valid)
			return res.code(401).send({ error: 'wrong credentials' })
		if (user.fa2_enabled === 1) {
			res.code(420).send({ message : `2fa code required for ${username}`})
			mail2fa(user)
		} else {
			const token = server.jwt.sign({
				username: user.username,
				mail: user.mail,
				userid: user.id
			}, process.env.JWT_SIGNIN_SECRET, {
				expiresIn: '1h'
			})
			if (process.env.DEBUG)
				console.log(`${user.username} logged in`)
			clients.push({username: user.username, userId : user.id})
			res.send({ token })
		}
	} catch (error) {
		res.send({ error })
	}
}

export const enable2fa = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nenable-2fa')

	const user = await req.jwtVerify()

	if (!user)
		return res.code(500).send({ error: 'something went wrong' })
	const secret = speakeasy.generateSecret()
	db.prepare('UPDATE users SET fa2_secret = ?, fa2_enabled = ? WHERE username = ?').run(secret.base32, 1, user.username)
	const userdb = db.prepare('SELECT * FROM users WHERE username = ?;').get(user.username)
	res.send({ message:  '2FA enabled' })
	console.log(`2FA enabled for user: ${userdb.username}`)
}

export const verify2fa = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nverify-2fa')

	const { username, fa2_code } = req.body
	try {
		const userdb = db.prepare('SELECT * FROM users WHERE username = ?;').get(username)
		if (!userdb.fa2_secret)
			return res.code(400).send({ error: '2FA secret is missing, please enable 2FA first' })
		if (userdb.fa2_enabled === 1) {
			let verif = speakeasy.totp.verify({
			  secret: userdb.fa2_secret,
			  encoding: 'base32',
			  token: fa2_code,
			  window: 2
			})
			if (verif) {
			  const token = server.jwt.sign({
				username: userdb.username,
				mail: userdb.mail,
				userid: userdb.id
			  }, process.env.JWT_SIGNIN_SECRET, {
				expiresIn: '1h'
			})
			if (process.env.DEBUG)
				console.log(`${userdb.username} logged in`)
			clients.push({username: userdb.username, userId : userdb.id})
			res.send({ token })
			} else
			  return res.code(401).send({ error: `invalid 2FA code` })
		} else {
			return res.code(401).send({ error: '2FA not enabled for this user' })
	  	}
	} catch (err) {
		console.error(err)
		return res.code(500).send({ error: 'something went wrong' })
	}
}

export const disable2fa = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\ndisable-2fa')

	try {
		const user = await req.jwtVerify()
	if (!user)
		return res.code(500).send({ error: 'something went wrong' })
	const result = db.prepare('UPDATE users SET fa2_secret = ?, fa2_enabled = ? WHERE username = ?')
		.run(null, 0, user.username)
	if (result.changes === 0) {
		return res.code(404).send({ error: 'user not found or 2FA already disabled' })
	}
	console.log(`2FA disabled for user: ${user.username}`)
	return res.send({ message: '2FA has been disabled' })
	} catch (err) {
		console.error(err)
		return res.code(500).send({ error: 'something went wrong while disabling 2FA' })
	}
}

const mail2fa = async (user) => {
	if (process.env.DEBUG)
		console.log('\nmail-2fa')

	try {
		if (!user.fa2_secret) {
			return res.send({ error: '2FA secret is missing, please enable 2FA first' })
		}
		// mail setup with nodemailer
		const transporter = nodemailer.createTransport({
    		host: process.env.MAIL_HOST,
    		port: 587,
    		auth: {
    		    user: process.env.MAIL_USER,
    		    pass: process.env.MAIL_PASS
    		}
		})
		// mail template
		const code = speakeasy.totp({
			secret: user.fa2_secret,
			encoding: 'base32',
			window: 1
		})
		let message = {
			from: `"${user.username}" <${process.env.MAIL_USER}>`,
			to: `"${user.username}" <${user.mail}>`,
			subject: 'Votre code 2fa',
			html: `<b>Votre code est : ${code}</b>`
		}
		transporter.sendMail(message, (err, info) => {
			if (err) {
				console.error('error sending email: ', err.message)
				return res.code(500).send({ error: 'error sending email' })
			}
			if (process.env.DEBUG)
				console.log(' email sent: ', info.response)
			res.send({ message: '2fa code sent to your email' })
		})
	} catch (err) {
		return res.code(500).send({ error: 'something went wrong' })
	}
}

export const signinAction = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nsigninAction')

	const { password, username, mail } = req.body

	if (process.env.DEBUG) {
		console.log(`username : ${username}`)
		console.log(`mail : ${mail}`)
	}

	const hashed_password = bcrypt.hashSync(password, 10)
	try {
		db.prepare('INSERT INTO users (username, password, mail, fa2_secret) VALUES (?, ?, ?, ?);').run(username, hashed_password, mail, null)
		const user = db.prepare('SELECT * FROM users WHERE username = ?;').get(username)
		//create token and send it to login right after signin
		const token = server.jwt.sign({
		username: user.username,
		mail: user.mail,
		userid: user.id
		}, process.env.JWT_SIGNIN_SECRET, {
			expiresIn: '1h'
		})
		if (process.env.DEBUG)
			console.log(`${user.username} signed in`)
		clients.push({username: user.username, userId : user.id})
		res.send({ token })
	} catch (err) {
		console.error("insertion error:", err.message);
		res.code(500).send({ error: err.message });
	}
}

export const logoutAction = async (req, res) => {
	if (process.env.DEBUG)
		console.log('\nlogoutAction')

	try {
		const user = await req.jwtVerify()

		if (!user)
			return res.code(401).send({ error: 'unauthorized' })

		clients.splice(clients.findIndex((client) => client.username === user.username), 1)

		if (process.env.DEBUG)
			console.log(`${user.username} has been logged out`)
		return res.send({ message: 'successfully logged out' })
	} catch (err) {
		console.error(err)
		return res.code(500).send({ error: 'something went wrong during logout' })
	}
}

export const reconnectAction = async (req, res) => {
	//if (process.env.DEBUG)
	//	console.log('\nreconnectAction')
	// if (process.env.DEBUG);
	// 	//console.log('reconnectAction')

	try {
		const token = await req.jwtVerify()

		if (!token)
		{
			return res.code(401).send({ error: 'unauthorized' })
		}

		// if (clients.findIndex((client) => client.username === token.username) >= 0)
		// 	return res.code(401).send("Player already logged somewhere")

		// if (process.env.DEBUG)
		// 	console.log(`${token.username} reconnected`)

		if (clients.findIndex((client) => client.username === token.username) < 0)
			clients.push({username: token.username, userId : token.userid})

	} catch (err) {
		console.error(err)
		console.error('salut cest moi')
		return res.code(500).send({ error: 'something went wrong during reconnect' })
	}
}

export const leaveClients = (username) => {
	if (process.env.DEBUG)
		console.log('\nleaveClients')

	clients.splice(clients.findIndex((client) => client.username === username), 1)
}
