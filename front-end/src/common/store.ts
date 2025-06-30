type player = {
  id: number;
  username: string | null;
  score: number;
};

export type players = player[];

type currentUser = {
  id: number;
  username: string | null;
};

type match = {
    id: number,
    currentUser: currentUser | null,
    playerNumber: number,
    players: players,
    winner: player | null
};

type matches = match[];

type tournament = {
    id: number,
    currentUser: currentUser,
    playerNumber: number,
    players: players,
    matches: matches,
    currentMatch: number,
    winner: player | null
    shouldUserLeave: boolean
};

type socketListenners = {
	matchListenners : boolean,
	jeux : any,
}

type SharedData = {
  socket: any,
  match: match,
  tournament: tournament,
  socketListenners : socketListenners,
  localGame : boolean,
  localGame2 : boolean,
  isPlaying : boolean,
  tournoi : boolean,
  keyHandler : any,
};

export const sharedData: SharedData = {
  socket: null,
  match: {
    id: 0,
    currentUser: {
        id: 0,
        username: null
    },
    playerNumber: 0,
    players: [],
    winner: null
  },
  tournament: {
    id: 0,
    currentUser: {
        id: 0,
        username: null
    },
    playerNumber: 4,
    players: [],
    matches: [],
    currentMatch: 0,
    winner: null,
    shouldUserLeave: false
  },
  socketListenners : {
	matchListenners : false,
	jeux : null,
  },
  localGame : false,
  localGame2 : false,
  isPlaying : false,
  tournoi : false,
  keyHandler : null,
};