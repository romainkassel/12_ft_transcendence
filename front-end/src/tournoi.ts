import { sharedData } from "./common/store.js";
import { displayMatchResults } from "./match.js";
import { displayMatchResultsTourney, getWinner } from "./tournament.js";
type player = {
  id: number;
  username: string | null;
  score: number;
};

type players = player[];

export class tournoi {

	// private
	listeJoueurs  : players;
	winner : [number, number, number];
	played = 0;

	constructor(listeJoueurs : players)
	{
		this.listeJoueurs = listeJoueurs;
		this.winner = [-1, -1, -1];
		// switch
		sharedData.socket.on("game end tournoi", (data : any) => {
			this.played++;
			switch (this.played) {
				case 1:
					this.winner[0] = data.id;
					getWinner(this.played - 1, data.id, true);
					break;
				case 2:
					this.winner[1] = data.id;
					getWinner(this.played - 1, data.id, true);
					break;
				case 3 :
					this.winner[2] = data.id;
					getWinner(this.played - 1, data.id, false);
					sharedData.socket.emit("end tournoi");					
					sharedData.socket.emit("register tournoi", {username_player_1: sharedData.tournament.players[0].username,
																username_player_2: sharedData.tournament.players[1].username,
																username_player_3: sharedData.tournament.players[2].username,
																username_player_4: sharedData.tournament.players[3].username,
																username_winner_1: sharedData.tournament.players[this.winner[0]].username,
																username_winner_2: sharedData.tournament.players[this.winner[1]].username,
																username_winner_3: sharedData.tournament.players[this.winner[2]].username})
					sharedData.socket.removeAllListeners("game end tournoi");
					break;
				default:
					break;
			}
			if (this.played != 3)
			{
				sharedData.socket.emit("local", 0);
				this.startTournament(this.played);
			}
			sharedData.socketListenners.jeux.clear();
			displayMatchResultsTourney("display-match-results-tourney");
		})
	}

	startTournament(i : number)
	{
		switch (i) {
			case 0:
				this.playGame(this.listeJoueurs[0], this.listeJoueurs[1], 1);
				break;
			case 1:
				this.playGame(this.listeJoueurs[2], this.listeJoueurs[3], 2);
				break;
			case 2:
				this.playGame(this.listeJoueurs[this.winner[0]], this.listeJoueurs[this.winner[1]], 3);
				break;
			default:
				break;
		}

	}

	playGame(player1 : player, player2 :player, i : number)
	{
		// set name to display
		sharedData.socket.emit("local", 0);
		//sharedData.socket.emit("ready");
		// remove listeners to custom tournament
	}

}