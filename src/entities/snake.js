const EventEmitter = require('events');
const config = require('../../config/config.js');

class Snake extends EventEmitter {
	constructor(id, cookie, name, color, position) {
		super();
		this._id = id;
		this._cookie_id = cookie;
		this._name = name;
		this._color = color;
		this._head = position;
		this._boost = false;
		this.init();
	}


	init() {
		this._speed = 1.79;
		this._body = this._head; // This is why the snake dies when it reach's half way

		//Direction angle
		this._D = 5.69941607541398 / 2 / Math.PI * 16777215;

		this._X = this.D;


		//Fullness amount of last part of snake
		//Fam is a float between 0 and 1, multiplied by to make it a 24 bit number to send to client
		this._fam = 0; //* 16777215
		this._xOff = 0;
		this._yOff = 0;

		//Starting snake sections is 2
		//Number of parts
		this._sct = config["snakeStartSize"];
		this._sc = Math.min(6, 1 + (this._sct - 2) / 106);
		this.scang = 0.13 + 0.87 * Math.pow((7 - this._sc) / 6, 2);

		this._spangdv = 4.8;
		this._spang = Math.max(this._speed / this._spangdv, 1);

		this._length = this._sct + this._fam;

		this._direction = {
			x: 1,
			y: 1,
			angle: ((0.033 * 1e3) * 0 * this.scang * this.spang)
		};
		this._parts = [];
		var i = 0;
		while (i < ((this._sct - 1) * 2)) {
			this._parts.push({
				x: this._head.x + 5 * i,
				y: this._head.y + 5 * i
			});
			i += 2;
		}

	}

	updateBoost() {
		if (this._boost && this._length > 2) {
			this._updateAngle();
			var sc = Math.min(6, 1 + (this._sct - 2) / 106);
			var baseSpeed = config["nsp1"] + config["nsp2"];
			var scale = 1;//baseSpeed / (config["nsp1"] + config["nsp2"] * sc + 0.1);
			
			this._speed += 1.45;
			if (this._speed > config["maxSpeed"]) this._speed = config["maxSpeed"];
			var sizeChange = baseSpeed - this._speed;
			if (sizeChange !== 0)
				this.increaseSize(sizeChange * 4);
			
			let distance = scale * config["snakeUpdateRate"] / 8 * this._speed / 4;
			this._direction.x = parseInt(Math.cos(this._direction.angle) * distance);
			this._direction.y = parseInt(Math.sin(this._direction.angle) * distance);
			this._head.x += this._direction.x;
			this._head.y += this._direction.y;
			
			console.log(distance);
			this.emit('update', this);
		}
	}

	//FIXME MOOVE THE SNAKE PARTS
	update(deltaTime) {
		//console.log(deltaTime - config['snakeUpdateRate']);
		if (!this._boost || (this._boost && this._length <= 2)) {
			this._updateAngle();
			var sc = Math.min(6, 1 + (this._sct - 2) / 106);
			var baseSpeed = config["nsp1"] + config["nsp2"];
			var scale = 1;//baseSpeed / (config["nsp1"] + config["nsp2"] * sc + 0.1);


			this._speed -= 1.95;
			if (this._speed < baseSpeed) this._speed = baseSpeed;
			
			let distance = scale * config["gameUpdateRate"] / 8 * this._speed / 4;
			this._direction.x = parseInt(Math.cos(this._direction.angle) * distance);
			this._direction.y = parseInt(Math.sin(this._direction.angle) * distance);
			this._head.x += this._direction.x;
			this._head.y += this._direction.y;

			
			if (Math.abs(this._xOff) < 80 && Math.abs(this._yOff) < 80) {
				this.emit('updateSmall', this);
			} else {
				this.emit('update', this);
			}
		}
	}

	
	_update(){
		
	}
	_updateAngle(){
		if(this._direction.angle == this._direction.expectedAngle) return;
		var degrees = this._direction.expectedAngle * (180/Math.PI) ;
		var degreesOld = this._direction.angle * (180/Math.PI);
		var maxDegrees = 90;
		var diff = degreesOld - degrees;

		if(Math.abs(diff) < maxDegrees || Math.abs(diff) > 360 - maxDegrees) {
			this._direction.angle = this._direction.expectedAngle;
			return;
		}
		
		if(degreesOld > degrees){
			if(diff - 180 > 0)  degreesOld += maxDegrees;
			if(diff - 180 < 0) degreesOld -= maxDegrees;
		}else if (degreesOld < degrees){
			if(diff + 180 > 0) degreesOld += maxDegrees;
			if(diff + 180 < 0) degreesOld -= maxDegrees;
		}
		
		if(degreesOld < 0) degreesOld += 360;
		if(degreesOld > 360) degreesOld -= 360;
		
		var rad = degreesOld * Math.PI / 180;
		this._direction.angle = rad;
	}

	//TODO FIX
	increaseSize(amount) {

		var fmlts = config["fmlts"];
		amount = fmlts[this._sct] * amount;

		this._fam += amount / 200;
		if (this._fam > 2) this._fam = 1.95;

		if (this._fam > 1) {
			this._fam -= 1;
			this._sct += 1;
			this.emit("increase", this);
			//TODO ADD PARTS 
			// if (client.snake.fam / 16777215 >= 1) {
			// 	client.snake.fam = 16777215;
			// 	var newparts = client.snake.parts[client.snake.parts.length - 1];
			// 	client.snake.parts.push(newparts);
			// 	client.snake.sct++;
			// 	broadcast(messages.increase.build(client.snake));
			// 	client.snake.fam = 0;
			// }
		} else if (this._fam < 0) {
			if (this._sct > 2) {
				this._sct -= 1;
				this._fam += 1;
				this.emit("decrease", this);
			} else {
				this._fam = 0;
				this.emit("fam", this);
			}
		} else {
			this.emit("fam", this);
		}
		this._length = this._sct + this._fam;
		//console.log("sct:" + this._sct + " fam: " + this._fam);
	}


	getScore() {
		var fpsls = config["fpsls"];
		var fmlts = config["fmlts"];
		var a = Math.floor(15 * (fpsls[this._sct] + this._fam / fmlts[this._sct] - 1) - 5) / 1;
		return a;
	}

	setBoost(enabled) {
		this._boost = enabled;
	}


	turn(radians){
		var old = this._direction.expectedAngle;
		old += radians;
		
		if(old > Math.PI*2) old -= Math.PI*2;
		if(old < 0) old += Math.PI*2;
		this._direction.expectedAngle = this._direction.angle + radians;
	
	}
	setExpectedAngle(radians) {
		var degrees = radians * (180/Math.PI) ;
	//	console.log(degrees);
		this._direction.expectedAngle = radians;
		return;
		

	}

	get xOff() {
		return this._xOff;
	}

	get yOff() {
		return this._yOff;
	}

	get speed() {
		return this._speed;
	}

	get fam() {
		return this._fam;
	}

	get sct() {
		return this._sct;
	}

	get length() {
		return this._length;
	}

	get direction() {
		return this._direction;
	}

	get spang() {
		return this._spang;
	}

	get skin() {
		return this._color;
	}

	get D() {
		return this._D;
	}

	get X() {
		return this._X;
	}

	get cookie_id() {
		return this._cookie_id;
	}

	get color() {
		return this._color;
	}

	get id() {
		return this._id;
	}

	get head() {
		return this._head;
	}

	get name() {
		return this._name;
	}

	get body() {
		return this._head;
		//return this._parts[this._parts.length-1];
	}

	get parts() {
		return this._parts;
	}

}


module.exports = Snake;




