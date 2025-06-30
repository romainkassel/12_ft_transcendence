

export class player{
    
	//private :
	#Name;
	#Socket;
	Id;
    #State;
	#Game;
	#Token;
	#killId;
	gameId;
	tournoi;

    constructor(newName, newSocket, token, id)
	{
        this.#Name = newName;
        this.#Socket = newSocket;
        this.Id = id;
		this.#Game = null;
		this.#State = null;
		this.#Token = token;
		this.#killId = null;
		this.gameId = -1;
		this.tournoi = null;
    }
	//public :
    name(newName){return newName ? this.#Name = newName : this.#Name;}
    state(newSate){return newSate ? this.#State = newSate : this.#State;}
    socket(socket){return socket ? this.#Socket = socket : this.#Socket;}
   
    isConnected(){return this.#Socket.connected}
	Game(newGame){
		if (newGame)
		{
			// console.log(newGame);
			this.#Game = newGame;
			this.#Socket.isPlaying = true;
			this.#Socket.emit("update playing status", {isPlaying : true, local : this.#Game == "local" ? true : false });
			this.#Socket.emit("message", "okkkkkkkkkkkkk")
		}
		else
		{
			if (this.#Game == null)
				this.#Socket.isPlaying = false;
		}
		return this.#Game ? this.#Game : null;
	}
	getGame()
	{
		return this.#Game;
	}
	token(token){return token ? this.#Token = token : this.#Token;}
	clearGame(){this.#Game = null;
		this.#Socket.isPlaying = false;
		this.#Socket.emit("update playing status", {isPlaying : false, local :  false });
	};

	disconnect(id)
	{
		this.#killId = id;
	};
	
	reconnect(socket)
	{
		if (this.#killId != null)
			clearTimeout(this.#killId);
		this.#Socket = socket;
		if (this.#Game != null)
		{
			this.#Socket.isPlaying = true;
			this.#Game.reconnect(socket, this);
			this.#Socket.emit("update playing status", {isPlaying : this.#Socket.isPlaying, local : this.#Game.type == "local" ? true : false });
			this.#Socket.emit("message", this.#Socket.isPlaying)
		}
		else
			this.#Socket.emit("update playing status", {isPlaying : false, local :false});
	}
}


