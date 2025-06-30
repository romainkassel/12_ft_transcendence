
export class localGame
{
	//private :
	#listePlayer;
	#playerPosition ;
	#ballPosition ;
	#Map;
	#vector ;
	#Size ;
	#barSize ;
	#Score;
	#end;
	#lastPlayer ;
	#nbPlayer ;
	#int;
	#intervaleId;
	#Id;
	#io;
	#maxSpeed;
	#currentSpeed;
	#bounce;
	state;
	#playerReady;
	#lastPos;
	#speed;
	#PauseI;
	#PausePlayer;
	#PauseID;
	#flag;
	type;
	#hasStarted;
	#isFF

	constructor(player, data)
	{
        console.log("New local game for :", player.socket().id);
        this.#listePlayer = player;
		player.Game(this);
		player.socket().on("ready", (data) => {this.ready(player.socket().id)});
		player.socket().on("move player", (data) => {this.movePlayer("playerId", data)});
		player.socket().on("start pause", (data) => {this.pause(player)});
		player.socket().on("ff", (data) => {this.ff(player.gameId)});

		this.#Map = "duo"
		this.#Size =  {x : 599, y : 437}
		this.#nbPlayer = 1;
		this.#end = 1;
		this.#ballPosition = {x : 0, y : 0};
		this.#playerPosition = [{x : 0, y : 0}, {x : 0, y : 0}]
		this.#vector = {x : 0, y : 0}
		this.#barSize = {l : 50, w : 1}
		this.#Score  = [0, 0]
		this.#int = [0 , 0]
		this.#lastPlayer = -1;
		this.#maxSpeed = 1;
		this.#currentSpeed =  1;
		this.#bounce = 0;
		this.state = false;
		this.#playerReady = [];
        player.socket().emit("start local game");
		this.#lastPos = {x : 0, y : 0};
		this.#speed = 1;
		this.#PauseI = 0;
		this.#PauseID = null;
		this.#PausePlayer = null;
		this.#flag = data;
		this.type = "local";
		this.#hasStarted = false;
		this.#isFF = false;
	}

	//public :
	#initVector()
	{
		var direction = Math.floor(Math.random() * 4);
		var angle = Math.round(Math.random() * 30);
        switch (direction) {
            case 0:
				// 30 - 60
                direction = 30 + angle;
                break;
            case 1:
				// 120 - 150
                direction = 120 + angle;
                break;
            case 2:
				// 210 - 240
                direction = 210 + angle;
                break;
            case 3:
				// 300 - 330
                direction = 300 + angle;
                break;
            default:
                break;
        }
		direction = direction * Math.PI / 180;
		this.#vector.x = Math.cos(direction) * 2;
		this.#vector.y = Math.sin(direction) * 2;
	}

	#initPlayerPos()
	{
		this.#playerPosition[0] = {x :this.#Size.x / 2, y : 10}
		this.#playerPosition[1] = {x :this.#Size.x / 2, y : this.#Size.y - 10}
	}

	// movePlayer(playerId, direction) {
    // 	const speed = 5;

    // 	if (playerId !== 0 && playerId !== 1) return;

    // 	if (direction === "left") {
    // 	    this.#playerPosition[playerId].x -= speed;
    // 	} else if (direction === "right") {
    // 	    this.#playerPosition[playerId].x += speed;
    // 	}

    // 	if (this.#playerPosition[playerId].x < 0) {
    // 	    this.#playerPosition[playerId].x = 0;
    // 	} else if (this.#playerPosition[playerId].x > this.#Size.x - this.#barSize.l) {
    // 	    this.#playerPosition[playerId].x = this.#Size.x - this.#barSize.l;
    // 	}

    // 	this.#listePlayer.socket().emit("receive data", {
    // 	    playerPosition: this.#playerPosition,
    // 	    ballPosition: this.#ballPosition,
    // 	    score: this.#Score
    // 	});
	// }



	movePlayer(playerId, direction)
	{
		if (this.#PauseID != null)
			return;
		// bouger player 1 et 2 dans le bon  sens
			if (direction == "left")
				this.#playerPosition[0].x -=5;
			else if (direction == "right")
				this.#playerPosition[0].x += 5;
			else if (direction == "a")
				this.#playerPosition[1].x -=5;
			else if (direction == "d")
				this.#playerPosition[1].x += 5;

			if (this.#playerPosition[0].x < 0)
				this.#playerPosition[0].x = 0
			else if (this.#playerPosition[0].x > this.#Size.x - this.#barSize.l) // limiter le deplacement
				this.#playerPosition[0].x = this.#Size.x - this.#barSize.l;
			if (this.#playerPosition[1].x < 0)
				this.#playerPosition[1].x = 0
			else if (this.#playerPosition[1].x > this.#Size.x - this.#barSize.l) // limiter le deplacement
				this.#playerPosition[1].x = this.#Size.x - this.#barSize.l;

			this.#listePlayer.socket().emit("receive data", {playerPosition:  this.#playerPosition, ballPosition : this.#ballPosition, score : this.#Score});
	}

	sendInfo()
	{
		//if (this.#hasStarted == true)
			this.#listePlayer.socket().emit("game attributs", {map : this.#Map, nbPlayers : 1, players : [{}, {}, {}, {}] , playerId : -1, size : 1});
		//else
		//	this.#listePlayer.socket().emit("game attributs", null);
	}

	#increaseScore(player)
	{
		player == 0 ? this.#Score[1]++ : this.#Score[0]++;
	}

	#score(pos)
	{
		if (pos.x != 0 && pos.x != this.#Size.x && pos.y != 0 && pos.y != this.#Size.y)
			return false;
		if (pos.y == 0)
		{
			this.#increaseScore(0);
			return true;
		}
		else if (pos.y == this.#Size.y)
		{
			this.#increaseScore(1);
			return true;
		}
		{
			if (pos.x <= 0)
				this.#int[0] = -this.#int[0];
			else if (pos.x >= this.#Size.x)
				this.#int[0] = -this.#int[0];
		}
		return false;
	}

	#hitPlayer()
	{
		if ((this.#ballPosition.y == 10 && (this.#ballPosition.x >= this.#playerPosition[0].x && this.#ballPosition.x <= this.#playerPosition[0].x  + this.#barSize.l)))
		{
			this.#lastPlayer = 0;
			this.#int[1] = -this.#int[1];
			this.#lastPlayer = 0;
			return true;
		}
		else if (this.#ballPosition.y == this.#Size.y - 10 && (this.#ballPosition.x >= this.#playerPosition[1].x && this.#ballPosition.x <= this.#playerPosition[1].x  + this.#barSize.l))
		{
			this.#lastPlayer = 1;
			this.#int[1] = -this.#int[1];
			this.#lastPlayer = 1;
			return true;
		}
		return false;
	}

	#ballSteps()
	{
		if (Math.abs(this.#vector.x) > Math.abs(this.#vector.y))
		{
			this.#int[0] = 1 * Math.sign(this.#vector.x);
			this.#int[1] = Math.sign(this.#vector.y) * Math.abs(this.#vector.y) / Math.abs(this.#vector.x);
		}
		else
		{
			this.#int[1] = 1 * Math.sign(this.#vector.y);
			this.#int[0] = Math.sign(this.#vector.x) * Math.abs(this.#vector.x) / Math.abs(this.#vector.y);
		}
	}

	#init()
	{
		this.#ballPosition = {x : this.#Size.x / 2, y : this.#Size.y / 2}
		this.#lastPos = this.#ballPosition;
		this.#initVector();
		this.#ballSteps();
		this.#lastPlayer = -1;
	}

	#steps()
	{
		this.#lastPos = this.#ballPosition;
		this.#ballPosition.x = Math.round(this.#ballPosition.x + this.#int[0]);
		if (this.#ballPosition.x <= 0)
				this.#ballPosition.x = 0;
		else if (this.#ballPosition.x >= this.#Size.x)
				this.#ballPosition.x = this.#Size.x;
		this.#ballPosition.y = Math.round(this.#ballPosition.y + this.#int[1]);
		if (this.#ballPosition.y <= 0)
			this.#ballPosition.y = 0;
		else if (this.#ballPosition.y >= this.#Size.y)
			this.#ballPosition.y = this.#Size.y;
	}


	#gameLoop()
	{
		if (this.#end == 0)
			this.#endGame();
		let i = 0;
		while (i < this.#speed) {
			this.#steps();
			if (this.#score(this.#ballPosition))
			{
				if (this.#Score.find(score => score === 5) !== undefined)
					this.#end = 0;
				this.#init();
				this.#speed = 1;
			}
			else if (this.#hitPlayer())
			{
				this.#bounce++;
				this.#speed++;
				if (this.#speed >= this.#maxSpeed)
					this.#maxSpeed = this.#speed;
			}
			i++;
		}
		this.#listePlayer.socket().emit("receive data", {playerPosition:  this.#playerPosition, ballPosition : this.#ballPosition, score : this.#Score});
	}

	#endGame()
	{
		console.log("game finished");
		clearInterval(this.#intervaleId);
		let id = this.#Score[0] > this.#Score[1] ? 0 : 1;
		let winner_color;
		if (this.#isFF == true)
			winner_color = "draw";
		else
			winner_color = this.#Score[0] > this.#Score[1] ? "blue" : "red";
		this.#listePlayer.socket().emit("game end", { id : id, winner_color : winner_color});
		this.#listePlayer.socket().emit("game end tournoi", { id : id });
		this.#listePlayer.socket().emit("game end redir");
		// this.#listePlayer.forEach(element => {
		// 	element.socket().off("ready");
		// 	element.socket().off("move player");
		// });

		this.#listePlayer.socket().removeAllListeners("ready");
		this.#listePlayer.socket().removeAllListeners("move player");
		this.#listePlayer.socket().removeAllListeners("start pause");
		this.#listePlayer.socket().removeAllListeners("ff");
		this.#listePlayer.socket().removeAllListeners("get game attributs");
		this.#listePlayer.clearGame(null);
	}

	startGame()
	{
		this.#hasStarted = true;
		this.sendInfo();
		if (this.state == true)
			return ;
		this.state =  true;
		this.#listePlayer.socket().emit("game start");
		this.#init();
		this.#initPlayerPos();
		this.#intervaleId = setInterval(this.#gameLoop.bind(this), 16);
	}

	#pauseLoop()
	{
		if (this.#PauseI == 10)
		{
			clearInterval(this.#PauseID);
			this.#intervaleId = setInterval(this.#gameLoop.bind(this), 16);
			this.#listePlayer.socket().emit("end pause");
			this.#PauseID = null;
		}
		this.#PauseI++;
		//console.log("pause i is :", this.#PauseI);
		this.#listePlayer.socket().emit("pause", ({timeElapsed : this.#PauseI, player : this.#PausePlayer.name()}));
	}

	pause(joueur)
	{
		if (this.#PauseID != null)
			return;
		clearInterval(this.#intervaleId);
		this.#PauseI = 0;
		this.#PausePlayer = joueur;
		this.#PauseID = setInterval( this.#pauseLoop.bind(this), 1000);
	}

	ff(id)
	{
		this.#end = 0;
		this.#isFF = true;
		// console.log("player left the game :", id);
	}

	ready(socketId)
	{
		if (this.#hasStarted == true)
			return ;
		this.startGame();
		return true;
	}

	sendDataToSocket(socket)
	{
		if (this.#hasStarted == true)
			socket.emit("game attributs", {map : this.#Map, nbPlayers : this.#nbPlayer, players : [{}, {}, {}, {}] , playerId : -1, size : this.#Size });
		else
			socket.emit("game attributs", null);
	}

	reconnect(socket)
	{
		this.#listePlayer.socket(socket);
		//socket.join(this.#Id);
		//socket.emit("game attributs", {map : this.#Map, nbPlayer : this.#nbPlayer, players : [{}, {}, {}, {}] , id : this.#Id})
		//if (this.state == true)
		{
			socket.on("ready", (data) => {this.ready(socket.id)});
			socket.on("move player", (data) => {this.movePlayer(socket.id, data)});
			socket.on("start pause", (data) => {this.pause(this.#listePlayer)});
			socket.on("get ", (data) => {this.sendDataToSocket(socket);});
			socket.on("get game attributs", (data) => {this.sendDataToSocket(socket);});
			socket.on("ff", (data) => {this.ff(this.#listePlayer.gameId)});
		}
	}

	forceKill(socket)
	{
		// console.log("Forced kill game");
		clearInterval(this.#intervaleId);
		this.#listePlayer.clearGame(null);
		this.#listePlayer.socket().removeAllListeners("ready");
		this.#listePlayer.socket().removeAllListeners("move player");
		this.#listePlayer.socket().removeAllListeners("start pause");
		this.#listePlayer.socket().removeAllListeners("ff");
		this.#listePlayer.socket().removeAllListeners("get game attributs");
	}
}