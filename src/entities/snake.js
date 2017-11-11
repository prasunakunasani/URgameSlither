const EventEmitter = require('events');
const config = require('../../config/config.js');

class Snake extends EventEmitter{
	constructor(id, cookie, name, color, position){
		super();
		this._id = id;
		this._cookie_id = cookie;
		this._name = name;
		this._color = color;
		this._head = position;
		this.init();
		this._boost = false;
	}
	
	get id(){
		return this._id;
	}
	
	get head(){
		return this._head;
	}
	
	get name(){
		return this._name;
	}
	
	get body(){
		return this._body;
	}
	
	init(){
		this._speed = 1.79;
		this._body = this._head; // This is why the snake dies when it reach's half way
		
		//Direction angle
		this._D = 5.69941607541398 / 2 / Math.PI * 16777215;
		
		this._X = this.D;

		

		//Fullness amount of last part of snake
		//Fam is a float between 0 and 1, multiplied by to make it a 24 bit number to send to client
		this._fam = 0; //* 16777215

		//Starting snake sections is 2
		//Number of parts
		this._sct = 2;
		this._sc =  Math.min(6, 1 + (this._sct - 2) / 106);
		this.scang = 0.13 + 0.87 * Math.pow((7 - this._sc) / 6, 2);
		
		
		
		this._spangdv = 4.8;
		this._spang = Math.max(this._speed/this._spangdv,1);

		this._length = this._sct + this._fam;
		this._length = 
		//this._score = Math.floor(15 * (fpsls[this._sct] + this._fam / fmlts[this._sct] - 1) - 5) / 1;


		this._direction = {
			x: 1,
			y: 1,
			angle: ((0.033 * 1e3) * 0 * this.scang * this.spang)
		};
		this.parts = [];
		var i = 0;
		while (i < 20) {
			this.parts.push({
				x: i + 1,
				y: i + 2
			});
			i += 2;
		}
	
	}
	
	setBoost(enabled){
		this._boost = enabled;
	}
	
	get length(){
		return this._length;
	}
	
	get direction(){
		return this._direction;
	}
	
	get spang(){
		return this._spang;
	}

	//FIXME MOOVE THE SNAKE PARTS
	update(deltaTime){
		//console.log(deltaTime - config['snakeUpdateRate']);
		let rate = config['snakeUpdateRate'] / 12;
		if(this._boost) rate *= 4;
		let distance = this._speed * rate;
		this._head.x += Math.cos(this._direction.angle) * distance;
		this._head.y += Math.sin(this._direction.angle) * distance;
		this.emit('update', this);
	}
	
	//TODO FIX
	increaseSize(amount){
		this._fam += amount / 100;
		if(this._fam > 1){
			this._fam -= 1;
			this.emit("increaseSnake", this);
			
			//TODO ADD PARTS 
			// if (client.snake.fam / 16777215 >= 1) {
			// 	client.snake.fam = 16777215;
			// 	var newparts = client.snake.parts[client.snake.parts.length - 1];
			// 	client.snake.parts.push(newparts);
			// 	client.snake.sct++;
			// 	broadcast(messages.increase.build(client.snake));
			// 	client.snake.fam = 0;
			// }
		}
		
	}
}


module.exports = Snake;




