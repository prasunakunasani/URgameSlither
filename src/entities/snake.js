const EventEmitter = require('events');
const config = require('../../config/config.js');

class Snake extends EventEmitter {
	constructor(id, cookie, name, color, position) {
		super();

		this._id = id;
		this._name = name;
		this._color = color;
		this._head = position;
		this._boost = false;
		this._lastSpeedSent = 0;
		this._lastAngleSent = 0;

		//Variables to record data
		this._data = {
			cookie_id: cookie,
			length: 0,
			duration: 0,
			kills: 0,
			boosts: 0,
			intervalData: {
				length: [],
				kills: []
			},
			largestSnake: 0
		};

		this._user = {
			cookie_id: cookie,
			snake: {
				name: name,
				color: color
			}
		};
		this._cookie_id = cookie;
		this._initTime = Date.now();
		this._time = this._initTime;
		this._lastIntervalTime = this._initTime - config["intervalRate"];
		this._killCounter = 0;

		this.init();

	}


	init() {
		this._speed = 5.79;
		//Direction angle
		this._D = 5.69941607541398 / 2 / Math.PI * 16777215;
		this._X = this.D;

		//Fullness amount of last part of snake
		//Fam is a float between 0 and 1, multiplied by to make it a 24 bit number to send to client
		this._fam = 0; //* 16777215

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
		for (var i = this._sct - 2; i >= 0; i--) {
			this._parts.push({
				x: this._head.x,
				y: this._head.y + 25 * i
			});

		}

	}

	finalRecord() {
		this._data.length = this.getScore();
		this._data.duration = (Date.now() - this._initTime) / 1000;
		this._data.intervalData.length.push(this.getScore());
		this._data.intervalData.kills.push(this._killCounter);
	}

	snakeKill(length) {
		this._data.largestSnake = Math.max(length, this._data.largestSnake);
		this._killCounter++;
		this._data.kills++;
	}

	updateData(deltaTime) {
		this._time += deltaTime;
		//Record data now
		if (this._time - this._lastIntervalTime > config["intervalRate"]) {
			this._lastIntervalTime = this._lastIntervalTime + config["intervalRate"];
			this._data.intervalData.length.push(this.getScore());
			this._data.intervalData.kills.push(this._killCounter);
			this._killCounter = 0;
		}
	}


	update(deltaTime, count) {
		var baseSpeed = config["nsp1"] + config["nsp2"];
		if (this._boost && this._length > 2 || this._speed > 8) {
			if (parseInt(count) % 4 == 0) {
				this._updateDirection(deltaTime * 4);
				this._updatePosition(deltaTime * 4);
			}

		} else {
			if (parseInt(count) % 12 == 0) {
				this._updateDirection(deltaTime * 12);
				this._updatePosition(deltaTime * 12);
			}
		}
	}

	_updatePosition(deltaTime) {
		var sc = Math.min(6, 1 + (this._sct - 2) / 106);
		var baseSpeed = config["nsp1"] + config["nsp2"];
		var scale = 1;// baseSpeed / (config["nsp1"] + config["nsp2"] * sc + 0.1);

		if (this._boost && this._length > 2) {
			this._speed += 1.45;

			if (this._speed > config["maxSpeed"]) this._speed = config["maxSpeed"];
		} else {
			this._speed -= 1.95;
			if (this._speed < baseSpeed) this._speed = baseSpeed;
		}

		let distance = scale * deltaTime / 8 * this._speed / 4;
		this._direction.x = parseInt(Math.cos(this._direction.angle) * distance);
		this._direction.y = parseInt(Math.sin(this._direction.angle) * distance);
		this._head.x += this._direction.x;
		this._head.y += this._direction.y;

		var sizeChange = baseSpeed - this._speed;
		if (sizeChange !== 0)
			this.increaseSize(sizeChange * 4);

		this._updateParts();
		if (Math.abs(this._direction.x) < 120 && Math.abs(this._direction.y) < 120) {
			this.emit("updateSmall", this);
		} else {
			this.emit('update', this);
		}
		this._lastSpeedSent = this._speed;
		this._lastAngleSent = this._direction.angle;
	}

	_updateParts() {
		var p = this._parts;
		var lastx = this._head.x;
		var lasty = this._head.y;
		for (var i = this._parts.length - 1; i >= 0; i--) {
			var tempx = p[i].x;
			var tempy = p[i].y;
			p[i].x = lastx;
			p[i].y = lasty;
			lastx = tempx;
			lasty = tempy;
		}

	}

	_updateDirection(deltaTime) {
		if (this._direction.angle == this._direction.expectedAngle) {
			return;
		}
		var rads = this._direction.expectedAngle;
		var radsOld = this._direction.angle;

		var maxRads = Math.PI * deltaTime / 800;

		var diff = radsOld - rads;

		if (Math.abs(diff) < maxRads || Math.abs(diff) > Math.PI * 2 - maxRads) {

			this._direction.angle = this._direction.expectedAngle;
			return;
		}
		//This makes sure to turn in correct direction
		if (radsOld > rads) {
			if (diff - Math.PI > 0) {
				this._direction.increasing = true;
			//	console.log("increasing1");
				radsOld += maxRads;
			}
			if (diff - Math.PI < 0) {
			//	console.log("decreasing1");
				this._direction.increasing = false;
				radsOld -= maxRads;
			}
		} else if (radsOld < rads) {
			if (diff + Math.PI > 0) {
				radsOld += maxRads;
				this._direction.increasing = true;
				//console.log("increasing2");
			}
			if (diff + Math.PI < 0) {
			//	console.log("decreasing2");
				radsOld -= maxRads;
				this._direction.increasing = false;
			}
		}

		if (radsOld < 0) radsOld += Math.PI * 2;
		if (radsOld > Math.PI * 2) radsOld -= Math.PI * 2;

		if (radsOld < 0) throw "weird angle";
		if (radsOld > Math.PI * 2) throw "weird angle";

		var rad = radsOld;
		this._direction.angle = rad;

		//unused
		this.emit("direction", this);

		// this.scang = 0.13 + 0.87 * Math.pow((7 - this._sc) / 6, 2);
		// this._spang = Math.max(this._speed / this._spangdv, 1);
		//this._direction.angle = ((0.033 * 1e3) * rad * this.scang * this.spang)

	}


	increaseSize(amount) {
		var lastScore = this.getScore();
		var fmlts = config["fmlts"];
		amount = fmlts[this._sct] * amount;

		this._fam += amount / 200;
		if (this._fam > 2) this._fam = 1.95;

		if (this._fam > 1) {
			this._fam -= 1;
			this._sct += 1;
			this.emit("increase", this);
			this._parts.push({
				x: this._head.x,
				y: this._head.y
			});

		} else if (this._fam < 0) {
			if (this._sct > 2) {
				this._sct -= 1;
				this._fam += 1;
				this.emit("decrease", this);
				if (this._parts.length > 2)
					this._parts.splice(0, 1);
			} else {
				this._fam = 0;
				this.emit("fam", this);
			}
		} else {
			this.emit("fam", this);
		}
		this._length = this._sct + this._fam;
		//console.log("sct:" + this._sct + " fam: " + this._fam);
		if (this.getScore() < lastScore) {
			this._data.boosts += (lastScore - this.getScore());
		}
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

	get data() {
		return this._data;
	}

	get user() {
		return this._user;
	}


	turn(radians) {
		var old = this._direction.angle;
		old += radians;
		//	console.log(radians);
		if (old > Math.PI * 2) old -= Math.PI * 2;
		if (old < 0) old += Math.PI * 2;

		this._direction.expectedAngle = old;

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
		return this._parts[0];
		//return this._parts[this._parts.length-1];
	}

	get parts() {
		return this._parts;
	}

}


module.exports = Snake;




