import {player} from "./class/player.js"
import {game} from "./class/game.js"
import { localGame } from "./class/localGame.js";
import { clients } from "./server.js";
import { jwtDecode } from "jwt-decode"
import { server } from "./server.js";
import { registerTournament } from "./actions/match.js";

var waitlistDuo = [];
var waitlistQuatuor = [];
var listGameDuo = [];
var listGameQuatuor = [];
var listPlayerDisconnected = [];
export let SocketClients = []

export function registerClient(socket, io)
{
	displayMessage(socket, "New instance");
	var state = false;
	socket.isPlaying = false;
	socket.on("auth", (data, callback) => {auth(socket, data, io, state, callback)});
	socket.on("message", (data) => {displayMessage(socket, data)});
	socket.on("is auth", (callback) => {callback(state); console.log("state is:",state);});
	socket.on("remove auth", (data) =>{socket.is_auth = false;});
}

function disconnectSocket(socket, data, joueur)
{
	displayMessage(socket, "socket disconnected");
	if (waitlistDuo.find((element) => element.socket().id == socket.id))
		waitlistDuo = waitlistDuo.filter((element) => {element.socket().id == socket.id});
	if (waitlistQuatuor.find((element) => element.socket().id == socket.id))
		waitlistQuatuor = waitlistQuatuor.filter((element) => {element.socket().id == socket.id});
	// if (joueur != null && joueur.Game() != null)
	// 	joueur.Game().ff(socket.id);
	// if (joueur != null)
	// 	joueur = null;
	if (!listPlayerDisconnected.find((element) => element.socket().id === socket.id))
		listPlayerDisconnected.push(joueur);

	if (SocketClients.find((element) => element.socket().id === socket.id))
	{
		SocketClients = SocketClients.filter((element) => element.socket().id != socket.id);
	}
	// clients.splice(clients.findIndex((element) => element.username != joueur.name()));
	// start a timer to destroy joueur
	joueur.disconnect(setTimeout(() => {
			listPlayerDisconnected = listPlayerDisconnected.filter((element) => element.socket().id != joueur.socket().id);
			console.log("player got killed", joueur.socket().id);
		}, 100000));
}

function auth(socket, data, io, state, callback)
{
	if (socket.is_auth)
		return ;
	socket.emit("message", "Bienvenue via Socket.IO");
	console.log("Client connecté via Socket.IO :", socket.id);
	//if () check if data is ok;

	var joueur = connect(data, socket);
	if (joueur == null)
	{
		callback(false);
		//socket.disconnect();
		return ;
	}
	//joueur.Game();
	socket.is_auth = true;
	//if (joueur)
	//console.log("Liste joueur online:", SocketClients);
	//console.log("Liste player disconnected", listPlayerDisconnected);
	socket.removeAllListeners("is auth");
	state = true;
	socket.on("is auth", (callback) => {callback(state);});
	socket.on("join waitlist", (data) => {joinWaitlist(socket, data, joueur, io);}); // attention game en cours
	socket.on("leave waitlist", (data) => {leaveWaitlist(socket, data, joueur, io);});
	socket.on("disconnect", (data) => {disconnectSocket(socket, data, joueur)});
	socket.on("local", (data) => {startLocalGame(socket, joueur, data)});
	socket.on("is playing", (callback) => {callback(joueur.Game() ? true : false, joueur.Game() ? joueur.Game().type : "null");});
	socket.on("tournament", (data) => {startTournament(socket, joueur, data);});
	// console.log("tournament listen ok");

	callback(true);
}

function startLocalGame(socket, joueur, data)
{
	if (joueur.Game() != null)
		return ;
	// console.log("roso");

	/// protection game en cours
	var partie = new localGame(joueur, data);
	leaveWaitlist(socket, data);
	// socket.off("join waitlist",);
	socket.emit("start local game", (data));
}

function startTournament(socket, joueur, data)
{
	// console.log("tournament called");
	if (joueur.Game() != null)
		return;
	//joueur.tournoi = data;
	socket.on("disconnect", (info) => {forceKill(socket, joueur, data, info);});
	socket.once("end tournoi", () => {socket.off("disconnect",(info) => {forceKill(socket, joueur, data, info)});socket.off("stop tournament", (data) => {forceKill(socket, joueur, data, info)})});
	socket.once("register tournoi", (data) => {registerTournament(data);});
	socket.once("stop tournament", (info) => {forceKill(socket, joueur, data, info);});
}

function forceKill(socket, joueur, data, info)
{
	// console.log("force kill called");

	if (joueur != null && joueur.getGame() != null)
	{
		joueur.getGame().forceKill(socket);
		console.log("game stopped");

	}
}

function connect(data, socket)
{
	// console.log("token is :", data);
	const raw = jwtDecode(data);
	var joueur;
	var reco = listPlayerDisconnected.find((element) => element.name() == raw.username)

	if (reco)
	{
		if (reco.socket().connected == true && reco.socket.id != socket.id)
			return null;
		// console.log("reco");
		reco.reconnect(socket);
		SocketClients.push(reco);
		listPlayerDisconnected = listPlayerDisconnected.filter((element) => element.name() == raw.username);
		// remove reco from listedisconnected
		displayMessage(socket, "player reconnected");
		return reco;
	}
	else
	{
		joueur = new player(raw.username, socket, data, raw.userid);
		SocketClients.push(joueur);
		return joueur;
	}
}


function displayMessage(socket, data)
{
	//console.log("User id :", socket.id, " message :", data);
}

function joinWaitlist(socket, data, joueur, io)
{
	if (joueur.Game() != null)
		return ;
	displayMessage(socket, "joined waitlist: ".concat(data));
	if (data == "duo")
	{
		if (!(waitlistDuo.find((element) => element.socket().id == socket.id)))
		{
			waitlistDuo.push(joueur);
			socket.join("waitlist duo");
		}
		if (waitlistDuo.length == 2)
		{
			var partie =  new game(waitlistDuo, listGameDuo.length, io, "waitlist duo");
			waitlistDuo = [];
			listGameDuo.push(partie);
		}
	}
	else if (data == "quatuor")
	{
		if (!(waitlistQuatuor.find((element) => element.socket().id == socket.id)))
		{
			waitlistQuatuor.push(joueur);
			socket.join("waitlist quatuor");
			io.to("waitlist quatuor").emit("users in queue", waitlistQuatuor.length);
		}
		if (waitlistQuatuor.length == 4)
		{
			var partie =  new game(waitlistQuatuor, listGameQuatuor.length, io, "waitlist quatuor");
			waitlistQuatuor = [];
			listGameQuatuor.push(partie);
		}
	}

	// socket.off("join waitlist");
}

function leaveWaitlist(socket, data, joueur, io)
{
	// socket.off("leave waitlist");
	displayMessage(socket, "left all waitlist");
	if (waitlistDuo.find((element) => element.socket().id == socket.id))
		waitlistDuo = waitlistDuo.filter((element) => {element.socket() == socket.id});
	if (waitlistQuatuor.find((element) => element.socket().id == socket.id))
	{
		waitlistQuatuor.splice(waitlistQuatuor.findIndex((element) => element.socket().id === socket.id), 1)
		io.to("waitlist quatuor").emit("users in queue", waitlistQuatuor.length);
	}

}
