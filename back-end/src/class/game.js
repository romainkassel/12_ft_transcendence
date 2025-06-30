import { registerMatch, registerSpecialMatch } from "../actions/match.js";

export class game
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
	#startTime;
	#endTime;
	#PauseI;
	#PausePlayer;
	#PauseID;
	#listIdUsername = [];
	#CurrentWinner;
	type;
	#hasStarted;

	constructor(listePlayer, id, io, waitlist)
	{
		if (listePlayer.length == 2)
			this.#Id = "duo game" + id;
		else if (listePlayer.length == 4)
			this.#Id = "quatuor game" + id;
		else
			this.#Id = "Error"

		// console.log("game id is :", this.#Id);
		this.#listePlayer = [];
		this.#io = io;
		if (listePlayer.length == 2)
		{
			this.#Map = "duo"
			this.#Size =  {x : 599, y : 437}
		}
		else if (listePlayer.length == 4)
		{
			this.#Size =  {x : 599, y : 437}
			this.#Map = "quatuor"
		}
		else
			this.#Map = "Error"
		this.#nbPlayer = listePlayer.length;
		this.#end = 1;
		this.#ballPosition = {x : 0, y : 0};
		this.#playerPosition = [{x : 0, y : 0}, {x : 0, y : 0}, {x : 0, y : 0}, {x : 0, y : 0}]
		this.#vector = {x : 0, y : 0}
		this.#barSize = {l : 50, w : 1}
		this.#Score  = [0, 0 , 0 , 0]
		this.#int = [0 , 0]
		this.#lastPlayer = -1;
		this.#maxSpeed = 1;
		this.#currentSpeed =  1;
		this.#bounce = 0;
		this.state = false;
		this.#playerReady = [];
		this.#lastPos = {x : 0, y : 0};
		this.#speed = 1;
		this.#PauseI = 0;
		this.#PauseID = null;
		this.#PausePlayer = null;
		this.#CurrentWinner =  {index : -1, score : 0};
		this.type = "remote";
		this.#hasStarted = false;
		listePlayer.forEach((element, index) => {
			this.#listePlayer.push(element);
			this.#listIdUsername.push({id: element.Id, username: element.name(), position : index});
			element.Game(this);
			element.socket().join(this.#Id);
			element.socket().leave(waitlist);
			element.socket().on("ready", (data) => {this.ready(element.socket().id)});
			element.socket().on("move player", (data) => {this.movePlayer(element.gameId, data)});
			element.socket().on("start pause", (data) => {this.pause(element)});
			element.socket().on("ff", (data) => {this.ff(element.gameId)});
		});
		this.#io.to(this.#Id).emit("game created", this.#listIdUsername);
	}

	//public :
	#initVector()
	{
		var direction = Math.floor(Math.random() * 4);
		var angle = Math.floor(Math.random() * 30);
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
		this.#vector.x = Math.cos(direction) * 1;
		this.#vector.y = Math.sin(direction) * 1;
	}

	#initPlayerPos()
	{
		this.#playerPosition[0] = {x :this.#Size.x / 2, y : 10}
		this.#playerPosition[1] = {x :this.#Size.x / 2, y : this.#Size.y - 10}
		if (this.#listePlayer.length == 4)
		{
			this.#playerPosition[2] = {x :10, y : this.#Size.y / 2}
			this.#playerPosition[3] = {x :this.#Size.x - 10, y : this.#Size.y / 2}
		}
	}

	movePlayer(Id, direction)
	{
		if (this.state == 0 || this.#PauseID != null)
			return ;
		if (Id <= 1)
		{
			if (direction == "left")
				this.#playerPosition[Id].x -=5;
			else if (direction == "right")
				this.#playerPosition[Id].x += 5;
			if (this.#playerPosition[Id].x < 0)
				this.#playerPosition[Id].x = 0
			else if (this.#playerPosition[Id].x > this.#Size.x - this.#barSize.l) // limiter le deplacement
				this.#playerPosition[Id].x = this.#Size.x - this.#barSize.l;
		}
		else if (Id >= 2)
		{
			if (direction == "up")
				this.#playerPosition[Id].y-= 5;
			else if (direction == "down")
				this.#playerPosition[Id].y+=5;
			if (this.#playerPosition[Id].y < 0)
				this.#playerPosition[Id].y = 0
			else if (this.#playerPosition[Id].y > this.#Size.y - this.#barSize.l)
				this.#playerPosition[Id].y = this.#Size.y - this.#barSize.l;
		}
		this.#io.to(this.#Id).emit("receive data", {playerPosition:  this.#playerPosition, ballPosition : this.#ballPosition, score : this.#Score});
	}

	sendInfo()
	{
		var i = 0;
		this.#listePlayer.forEach(element => {
			element.gameId = i;
			element.socket().emit("game attributs", {map : this.#Map, nbPlayers : this.#nbPlayer, players : [{}, {}, {}, {}] , playerId : i, size : this.#Size });
			i++;
		});
	}

	#increaseScore(player)
	{
		if (this.#lastPlayer == -1 && this.#nbPlayer == 4)
		{
			return ;
		}
		else if (this.#lastPlayer == -1 && this.#nbPlayer == 2)
		{
			const scoring_player = player == 0 ? 1 : 0
			this.#Score[scoring_player]++;
			this.#lastPlayer = scoring_player;
		}
		else
			this.#Score[this.#lastPlayer]++;
		if (this.#Score[this.#lastPlayer] > this.#CurrentWinner.score)
		{
			this.#CurrentWinner.index = this.#lastPlayer;
			this.#CurrentWinner.score = this.#Score[this.#lastPlayer];
		}
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
		if (this.#nbPlayer == 4)
		{
			if (pos.x == 0)
			{
				this.#increaseScore(2);
				return true;
			}
			else if (pos.x == this.#Size.x)
			{
				this.#increaseScore(3);
				return true;
			}
		}
		else
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
			this.#int[1] = -this.#int[1];
			this.#lastPlayer = 0;
			return true;
		}
		else if (this.#ballPosition.y == this.#Size.y - 10 && (this.#ballPosition.x >= this.#playerPosition[1].x && this.#ballPosition.x <= this.#playerPosition[1].x  + this.#barSize.l))
		{
			this.#int[1] = -this.#int[1];
			this.#lastPlayer = 1;
			return true;
		}
		if (this.#nbPlayer == 4)
		{
			if (this.#ballPosition.x == 10 && (this.#ballPosition.y >= this.#playerPosition[2].y && this.#ballPosition.y <= this.#playerPosition[2].y  + this.#barSize.l))
			{
				this.#int[0] = -this.#int[0];
				this.#lastPlayer = 2;
				return true;
			}
			else if (this.#ballPosition.x == this.#Size.x - 10 && (this.#ballPosition.y >= this.#playerPosition[3].y && this.#ballPosition.y <= this.#playerPosition[3].y  + this.#barSize.l) )
			{
				this.#int[0] = -this.#int[0];
				this.#lastPlayer = 3;
				return true;
			}
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
				this.#lastPlayer = -1;
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
		this.#io.to(this.#Id).emit("receive data", {playerPosition:  this.#playerPosition, ballPosition : this.#ballPosition, score : this.#Score});
	}

	#endGame()
	{
		this.#endTime = new Date();
		console.log("game finished");
		clearInterval(this.#intervaleId);
		let winner = this.#CurrentWinner.index;
		this.#io.to(this.#Id).emit("game end redir");

		console.log("winner is: ",winner);
		if (winner >= 0)
			this.#io.to(this.#Id).emit("game end", {id: this.#listePlayer[winner].Id, winnername: this.#listePlayer[winner].name()});
		else
			this.#io.to(this.#Id).emit("game end", {id: -1, winnername: "draw"});
		if (this.#listePlayer.length == 2 && (winner >= 0 && winner <= 1))
		{
			registerMatch({
				id_winner: this.#listePlayer[winner].Id,
				id_player_1: this.#listePlayer[0].Id,
				id_player_2: this.#listePlayer[1].Id,
				score_player_1: this.#Score[0],
				score_player_2: this.#Score[1],
				duration: Math.round((this.#endTime - this.#startTime) / 1000),
				bounces: this.#bounce,
				max_speed: this.#maxSpeed})
		}
		else if (this.#listePlayer.length == 4 && (winner >= -1 && winner <= 3))
		{
			let id_winner = winner == -1 ? -1 : this.#listePlayer[winner].Id;
			registerSpecialMatch({
				id_winner: id_winner,
				id_player_1: this.#listePlayer[0].Id,
				id_player_2: this.#listePlayer[1].Id,
				id_player_3: this.#listePlayer[2].Id,
				id_player_4: this.#listePlayer[3].Id,
				score_player_1: this.#Score[0],
				score_player_2: this.#Score[1],
				score_player_3: this.#Score[2],
				score_player_4: this.#Score[3],
				duration: Math.round((this.#endTime - this.#startTime) / 1000),
				bounces: this.#bounce,
				max_speed: this.#maxSpeed})
		}
		this.#listePlayer.forEach(element => {
			element.socket().removeAllListeners("ready");
			element.socket().removeAllListeners("move player");
			element.socket().removeAllListeners("start pause");
			element.socket().removeAllListeners("ff");
			element.socket().removeAllListeners("get game attributs");
			element.socket().leave(this.#Id);
			element.clearGame(null);
		});
	}

	startGame()
	{
		this.#hasStarted = true;
		this.sendInfo();
		if (this.state == true)
			return ;
		this.state =  true;
		this.#io.to(this.#Id).emit("game start");
		this.#init();
		this.#initPlayerPos();
		this.#intervaleId = setInterval(this.#gameLoop.bind(this), 16);
		this.#startTime = new Date();
	}

	#pauseLoop()
	{
		if (this.#PauseI == 10)
		{
			clearInterval(this.#PauseID);
			this.#intervaleId = setInterval(this.#gameLoop.bind(this), 16);
			this.#io.to(this.#Id).emit("end pause");
			this.#PauseID = null;
		}
		this.#PauseI++;
		//console.log("pause i is :", this.#PauseI);
		this.#io.to(this.#Id).emit("pause", ({timeElapsed : this.#PauseI, player : this.#PausePlayer.name()}));
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
		this.#Score[id] = 0;
		this.#end = 0;
		if (this.#nbPlayer == 2)
			this.#CurrentWinner.index = (id == 0 ? 1 : 0);
		else
        {
            if (this.#CurrentWinner.index == id)
            {
                this.#CurrentWinner.index = -1;
            }
        }
		console.log("player left the game :", id);
	}

	ready(socketId)
	{

		if (!this.#playerReady.find((element) => element == socketId))
			this.#playerReady.push(socketId);
		if (this.#playerReady.length == this.#nbPlayer)
			this.startGame();
		// console.log(this.#playerReady, this.#nbPlayer);
		// console.log("player ready", this.#playerReady.length == this.#nbPlayer);
		return false;
	}

	sendDataToSocket(socket)
	{
		var i = this.#listePlayer.findIndex((element) => element.socket().id == socket.id);
		if (this.#hasStarted == true)
			socket.emit("game attributs", {map : this.#Map, nbPlayers : this.#nbPlayer, players : [{}, {}, {}, {}] , playerId : i, size : this.#Size });
		else
			socket.emit("game attributs", null);
	}

	reconnect(socket, joueur)
	{
		socket.join(this.#Id);
		// console.log(joueur, "joueur");
		socket.once("redisplay match", (callback) => (callback(this.#listIdUsername, this.#hasStarted)));
		//socket.emit("game attributs", {map : this.#Map, nbPlayer : this.#nbPlayer, players : [{}, {}, {}, {}] , id : this.#Id})
		//if (this.s"tate == true)
		{
			socket.on("ready", (data) => {this.ready(socket.id)});
			socket.on("move player", (data) => {this.movePlayer(joueur.gameId, data)});
			socket.on("start pause", (data) => {this.pause(joueur);});
			socket.on("get game attributs", (data) => {this.sendDataToSocket(socket);});
			socket.on("ff", (data)=>{this.ff(joueur.gameId)});
		}
	}

}


