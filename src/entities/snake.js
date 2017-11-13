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
		this._count = 0;
		this._speed = 1.79;
		this._actualSpeed = 5.79;
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

	updateDirection(deltaTime){
		this._updateDirection(deltaTime);
	}

	//FIXME MOOVE THE SNAKE PARTS
	update(deltaTime, count) {
	
		this._update(deltaTime, count);
		
		
	}

	_updatePosition(deltaTime) {
		var sc = Math.min(6, 1 + (this._sct - 2) / 106);
		var baseSpeed = config["nsp1"] + config["nsp2"];
		var scale = 1;//baseSpeed / (config["nsp1"] + config["nsp2"] * sc + 0.1);
	
		if (this._boost && this._length > 2) {
			this._speed += 1.45;
		
			if (this._speed > config["maxSpeed"]) this._speed = config["maxSpeed"];
		} else {
			this._speed -= 1.95;
			if (this._speed < baseSpeed) this._speed = baseSpeed;
		}

		var sizeChange = baseSpeed - this._speed;
		if (sizeChange !== 0)
			this.increaseSize(sizeChange * 4);

		let distance = scale * deltaTime / 8 * this._speed / 4;
		this._direction.x = Math.cos(this._direction.angle) * distance;
		this._direction.y = Math.sin(this._direction.angle) * distance;
		this._head.x += this._direction.x;
		this._head.y += this._direction.y;

		this._updateParts();
		this.emit('update', this);
	}
	
	_updateParts(){
		this._parts.forEach(p=>{
			p.x = this._head.x;
			p.y = this._head.y;
		})
	}
	
	
	_update(deltaTime, count) {
		if (this._boost && this._length > 2) {
			if(count % 5 == 0){
				console.log(this._count);
				this._updatePosition(deltaTime*5);
			}
			
		} else {
			if(this.isTurning()){
				if(count % 5 == 0){
					this._updatePosition(deltaTime*5);
				}
				if (count % 12 == 0)
					this._updatePosition(deltaTime*5);
			}else{
				if (count % 12 == 0)
					this._updatePosition(deltaTime*2.4*5);
			}
			
		}
	}

	isTurning(){
		return this._direction.angle != this._direction.expectedAngle
	}

	_updateDirection(deltaTime) {
		if (this._direction.angle == this._direction.expectedAngle) {
			return;
		}
		var rads = this._direction.expectedAngle;
		var radsOld = this._direction.angle;
		var maxRads = Math.PI / 6 * deltaTime/config["snakeUpdateRate"] ;
		
		var diff = radsOld - rads;

		if (Math.abs(diff) < maxRads || Math.abs(diff) > Math.PI * 2 - maxRads) {

			this._direction.angle = this._direction.expectedAngle;
			return;
		}

		//This makes sure to turn in correct direction
		if (radsOld > rads) {
			if (diff - Math.PI > 0) radsOld += maxRads;
			if (diff - Math.PI < 0) radsOld -= maxRads;
		} else if (radsOld < rads) {
			if (diff + Math.PI > 0) radsOld += maxRads;
			if (diff + Math.PI < 0) radsOld -= maxRads;
		}

		if (radsOld < 0) radsOld += Math.PI * 2;
		if (radsOld > Math.PI * 2) radsOld -= Math.PI * 2;

		if (radsOld < 0) throw "weird angle";
		if (radsOld > Math.PI * 2) throw "weird angle";

		var rad = radsOld;
		this._direction.angle = rad;

		this.emit("direction", this);

		this.scang = 0.13 + 0.87 * Math.pow((7 - this._sc) / 6, 2);
		this._spang = Math.max(this._speed / this._spangdv, 1);
		//this._direction.angle = ((0.033 * 1e3) * rad * this.scang * this.spang)

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


	turn(radians) {
		var old = this._direction.expectedAngle;
		old += radians;

		if (old > Math.PI * 2) old -= Math.PI * 2;
		if (old < 0) old += Math.PI * 2;
		this._direction.expectedAngle = this._direction.angle + radians;

	}

	setExpectedAngle(radians) {
		var degrees = radians * (180 / Math.PI);
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




