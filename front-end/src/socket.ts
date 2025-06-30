import {sharedData} from "./common/store.js"
import { sanitizeHTML } from "./common/xssPrev.js";
import { getLoadingView } from "./views/mainViews.js";
import { handleLoadAndPopstateEvents } from "./index.js";
import { displayMatchResults, movePlayer, updateMatchButtons } from "./match.js";
import { game } from "./game.js";
import { stopPause } from "./match.js";
import { tournoi } from "./tournoi.js";

const ioFunction = (window as any).io;

export function createSocket()
{
	var socket : any;
	if (sharedData.socket == null)
	{
		socket = ioFunction("wss://"+ "{TRANSCENDENCE_IP}"+":8080", {
		path: "/socket.io/",
		withCredentials: true,
		transports: ['websocket'],
		timeout: 5000,
		reconnectionAttempts: 3
		});

		socket.on("connect_error", (err : any) => {
		  // the reason of the error, for example "xhr poll error"
			//console.log("message :",err.message);

		  // some additional description, for example the status code of the initial HTTP response
			//console.log("description :",err.description);

			// some additional context, for example the XMLHttpRequest object
			//console.log("context :",err.context);
		});
		sharedData.socket = socket;
	}
}

// socket.on("connect", () => {
// 	sharedData.socket = socket;
// 	console.log("✅ Connecté au serveur Socket.IO");
// 	socket.on("token not found", (data : any) => {handleRooting("/login", null, false); console.log(data);
//     });

// 		});

export function endLoading()
{
	handleLoadAndPopstateEvents();
}

function removePLayerList()
{
	const playerList = document.getElementById("player-list");

	if (playerList === null)
	{
		return ;
	}

	playerList.remove();
}

function updateWaitlistSize(waitlistQuatuorLength: number)
{
	const placeholder = document.getElementById("waitlist-size") as HTMLParagraphElement;

	if (placeholder === null)
	{
		return ;
	}

	placeholder.innerText = String(waitlistQuatuorLength);
}

export function waitForSocket()
{
	const view = getLoadingView();
	{




	sharedData.socket.on("connect", () => {
		const keysPressed: Record<string, boolean> = {};

		document.addEventListener("keydown", (e: KeyboardEvent) => {
		  keysPressed[e.key] = true;
		});

		document.addEventListener("keyup", (e: KeyboardEvent) => {
		  keysPressed[e.key] = false;
		});

		if (sharedData.keyHandler == null)
		{
			sharedData.keyHandler = setInterval(() => {
				if (sharedData.socket == null)
					return ;
				if (keysPressed["ArrowLeft"]) {
					sharedData.socket.emit("move player", "left" );
				} else if (keysPressed["ArrowRight"]) {
					sharedData.socket.emit("move player", "right" );
				}

				if (keysPressed["a"]) {
					sharedData.socket.emit("move player", "a" );
				} else if (keysPressed["d"]) {
					sharedData.socket.emit("move player", "d" );
				}
				if (keysPressed["w"])
				{
					sharedData.socket.emit("move player", "up" );
				}else if (keysPressed["s"])
				{
					sharedData.socket.emit("move player", "down" );
				}
			}, 16);
		}

		//console.log("✅ Connecté au serveur Socket.IO");
		sharedData.socket.on("update playing status", (state : any) => {
			sharedData.isPlaying = state.isPlaying;
			sharedData.localGame = state.local;})
		//this.#Socket.emit("update playing status", this.#Socket.isPlaying);
		sharedData.socket.on("users in queue", (waitlistQuatuorLength: number) => {
			updateWaitlistSize(waitlistQuatuorLength);
		});

		sharedData.socket.on("game attributs", (info : any) => {
			if (info == null)
				return ;
			var c = <HTMLCanvasElement> document.getElementById("myCanvas");
			var ctx =  c.getContext("2d");
			var jeux : any = null;
			updateMatchButtons();
			removePLayerList();

			jeux = new game(info.map, info.nbPlayers, info.players, ctx, c, info.size, info.playerId);

			/*console.log("info: ", info);

			if (sharedData.match.players.length === 0)
			{
				sharedData.match.players = info.front;
			}*/
			sharedData.socket.removeAllListeners("game end redir");
			sharedData.socket.on("game end redir", (data:any) => {
				// console.log("tournoi :", sharedData.tournoi);
				// if (sharedData.tournoi == false)
				// {
				// 	console.log("hello");
				// 	displayMatchResults(data);
				// }
			})

			sharedData.socketListenners.jeux = jeux;

			sharedData.socket.removeAllListeners("receive data");
			sharedData.socket.removeAllListeners("end pause");
			sharedData.socket.removeAllListeners("game end");
			sharedData.socket.removeAllListeners("pause");

			sharedData.socket.on("receive data", (data : any) => {
				if (jeux == null)
					return ;
				jeux.receiveData(data.playerPosition, data.ballPosition, data.score);
				jeux.draw();
			});
			sharedData.socket.on("game end", (data : any) => {
				// console.log("end game");

				if (sharedData.tournoi == false)
				{
					sharedData.isPlaying = false;
					sharedData.localGame = false;
				}

				if (sharedData.tournoi != true)
				{
					displayMatchResults(data);
				}

				jeux = null;
				sharedData.socket.removeAllListeners("receive data");
				sharedData.socket.removeAllListeners("end pause");
				sharedData.socket.removeAllListeners("pause");
				//document.removeEventListener("keydown", movePlayer);
				// display winning screen
				sharedData.socketListenners.matchListenners = false;
				sharedData.socketListenners.jeux == null;
				sharedData.match.winner = data.id;
			})
			sharedData.socketListenners.matchListenners = true;
			sharedData.socket.on("end pause", stopPause);
			sharedData.socket.on("pause", (data : any) => {
					jeux.drawPause(data.timeElapsed);
			})
			})
			endLoading();
	});
	}
	//console.log("waiting for socket connection");
	document.body.innerHTML = sanitizeHTML(view);
}