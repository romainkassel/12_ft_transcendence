import { loginAction, logoutAction, signinAction, enable2fa, disable2fa, verify2fa, reconnectAction } from "./actions/auth.js";
import { addFriend, getFriends, removeFriend } from "./actions/friend.js";
import { getProfile, getProfileID, updateAvatar, updatePassword, getAvatar } from "./actions/profile.js";
import { debugCreaMatch, debugCreaSpecialMatch, getHistory, getMatchData, getSpecialHistory, getSpecialMatchData} from "./actions/match.js";
import { collectDefaultMetrics, register } from 'prom-client'
import { clients } from "./server.js";


export default async function routes(server, options) {

	// authentification
	server.post('/login', loginAction);
	server.post('/verify-2fa', verify2fa);
	server.post('/enable-2fa', { onRequest: server.jwtAuth }, enable2fa);
	server.post('/disable-2fa', { onRequest: server.jwtAuth }, disable2fa);
	server.post('/signin', signinAction);
	server.post('/logout', { onRequest: server.jwtAuth }, logoutAction);
	server.post('/reconnect', reconnectAction);

	// profile
	server.get('/profile', { onRequest: server.jwtAuth }, getProfile);
	server.get('/profile/:id', { onRequest: server.jwtAuth }, getProfileID);
	server.put('/password', { onRequest: server.jwtAuth }, updatePassword);
	server.put('/avatar', { onRequest: server.jwtAuth }, updateAvatar);
	server.get('/avatar/:id', { onRequest: server.jwtAuth }, getAvatar);

	// friends
	server.get('/friend', { onRequest: server.jwtAuth }, getFriends);
	server.post('/friend', { onRequest: server.jwtAuth }, addFriend);
	server.delete('/friend', { onRequest: server.jwtAuth }, removeFriend);

	// matchs
	server.get('/match-history', { onRequest: server.jwtAuth }, getHistory);
	server.get('/special-match-history', { onRequest: server.jwtAuth }, getSpecialHistory);
	server.get('/match/:id', { onRequest: server.jwtAuth }, getMatchData);
	server.get('/special-match/:id', { onRequest: server.jwtAuth }, getSpecialMatchData);

	// Get metrics through prom-client registery
	collectDefaultMetrics()
	server.get('/metrics', async (req, res) => {
		try {
			res.header('Content-Type', register.contentType);
			res.send(await register.metrics());
		} catch (ex) {
			res.status(500).send(ex.message);
		}
	});

	// debug
	server.post('/create-match', debugCreaMatch);
	server.post('/create-special-match', debugCreaSpecialMatch);

	server.get('/', (req, res) => {
		console.log('get index')
		console.log('clients : ', clients)
		res.send(clients)
	});

}
