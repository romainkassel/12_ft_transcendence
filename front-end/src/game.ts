export class game {
	#map = "null";
	#nbPlayers = 0;
	#players = [4];
	#playerPosition : {x : number, y : number}[] = [];
	#ballPosition = {x : 0, y : 0}
	#dimensions;
	#ctx;
	#canvas;
	#playerId;
	#img;
	#offset : {x: number, y: number} = {x: 0, y: 0};
	#score :  [number, number, number, number];

	constructor(map : string, nbPlayers : number, players : [4], ctx : any, canvas : any, size : {x : number, y: number}, id : number) {

		this.#map = map;
		this.#nbPlayers = nbPlayers;
		this.#players = players;
		this.#ctx = ctx;
		this.#canvas = canvas;
		this.#dimensions = size;
		this.#dimensions = size;
		if (map == "duo")
		{
			ctx.canvas.width  = 1020;
			ctx.canvas.height = 560;
			this.#img = new Image();
			this.#img.src = "./src/duo.png";
			this.#offset = {x : 211 , y : 65};
		}
		else if (map == "quatuor")
		{
			ctx.canvas.width  = 1020;
			ctx.canvas.height = 560;
			this.#img = new Image();
			this.#img.src = "./src/duo.png";
			this.#offset = {x : 211 , y : 65};
		}
		this.#playerId = id;
		this.#score = [0, 0, 0, 0];
	}

	//pos x : 211 / 810 , y : 65  / 502

	draw()
	{
		//this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
		this.#ctx.drawImage(this.#img, 0, 0);
		//draw map transparents
		this.#ctx.fillStyle = "red";
		this.#ctx.fillRect(this.#playerPosition[0].x + this.#offset.x, this.#playerPosition[0].y - 5 + this.#offset.y , 50, 5);
		this.#ctx.fillRect(this.#playerPosition[1].x + this.#offset.x, this.#playerPosition[1].y + this.#offset.y, 50, 5);
		if (this.#nbPlayers == 4)
		{
			this.#ctx.fillRect(this.#playerPosition[2].x + this.#offset.x - 5, this.#playerPosition[2].y + this.#offset.y, 5, 50);
			this.#ctx.fillRect(this.#playerPosition[3].x + this.#offset.x, this.#playerPosition[3].y + this.#offset.y, 5, 50);
		}
		this.#ctx.fillStyle = "blue";
		switch (this.#playerId) {
			case 0:
				this.#ctx.fillRect(this.#playerPosition[0].x + this.#offset.x, this.#playerPosition[0].y - 5 + this.#offset.y , 50, 5);
				break;
			case 1:
				this.#ctx.fillRect(this.#playerPosition[1].x + this.#offset.x, this.#playerPosition[1].y + this.#offset.y, 50, 5);
				break;
			case 2:
				this.#ctx.fillRect(this.#playerPosition[2].x + this.#offset.x - 5, this.#playerPosition[2].y + this.#offset.y, 5, 50);
				break;
			case 3:
				this.#ctx.fillRect(this.#playerPosition[3].x + this.#offset.x, this.#playerPosition[3].y + this.#offset.y, 5, 50);
				break;
			case -1:
				this.#ctx.fillRect(this.#playerPosition[0].x + this.#offset.x, this.#playerPosition[0].y - 5 + this.#offset.y , 50, 5);
				break;
			default:
				break;
		}
	this.drawScore();
	this.#ctx.fillStyle = "white";
	this.#ctx.fillRect(this.#ballPosition.x + this.#offset.x, this.#ballPosition.y + this.#offset.y, 5, 5);
	}

	receiveData(playerPosition : {x : number, y : number}[], ballPosition : {x : number, y : number}, score : any)
	{
		this.#playerPosition = playerPosition;
		this.#ballPosition = ballPosition;
		this.#score = score;
	}

	drawPause(time: number)
	{
		// draw time elapsed in the middle;
		this.draw();
		this.#ctx.font = "48px serif";
		this.#ctx.fillStyle = "grey";
		if (time == 11)
			return ;
		this.#ctx.fillText(10 - time, this.#canvas.width / 2, this.#canvas.height / 2);
	}

	drawScore()
	{
		this.#ctx.font = "48px serif";
		this.#ctx.fillStyle = "#ff8fa3";
		this.#ctx.fillText(this.#score[0], this.#canvas.width / 2, 70 + this.#offset.y);
	  	this.#ctx.fillText(this.#score[1], this.#canvas.width / 2, 400 + this.#offset.y);
		if (this.#nbPlayers == 4)
		{
			this.#ctx.fillText(this.#score[2], 35 + this.#offset.x, (this.#canvas.height / 2) + 20);
			this.#ctx.fillText(this.#score[3],  600 - 65 + this.#offset.x, (this.#canvas.height / 2) + 20);
		}
		this.#ctx.fillStyle = "#669bbc";
		switch (this.#playerId) {
			case 0:
				this.#ctx.fillText(this.#score[0], this.#canvas.width / 2, 70 + this.#offset.y);
				break;
			case 1:
				this.#ctx.fillText(this.#score[1], this.#canvas.width / 2, 400 + this.#offset.y);
				break;
			case 2:
				this.#ctx.fillText(this.#score[2], 35 + this.#offset.x, (this.#canvas.height / 2) + 20);
				break;
			case 3:
				this.#ctx.fillText(this.#score[3],  600 - 65 + this.#offset.x, (this.#canvas.height / 2) + 20);
				break;
			case -1:
				this.#ctx.fillText(this.#score[0], this.#canvas.width / 2, 70 + this.#offset.y);
				break;
			default:
				break;
		}
	}

	clear()
	{
		//this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
		this.#ctx.drawImage(this.#img, 0, 0);
	}

	displayMsg(string : string)
	{

		this.#ctx.drawImage(this.#img, 0, 0);
		this.#ctx.font = "48px serif";
		this.#ctx.fillText(string, this.#canvas.width / 2 - string.length,  this.#canvas.height / 2);
	}

}





