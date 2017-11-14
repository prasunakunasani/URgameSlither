const World = require("./world");
const Leaderboard = require("../subjects/leaderboard");
const Snake = require("./snake");
const LeaderboardObserver = require("../observers/leaderboardObserver");
const Position = require("./position");

const EventEmitter = require('events');
const config = require('../../config/config');
const message = require('../utils/message');

class Game extends EventEmitter {
	constructor() {
		super();
		this._lastUpdate = Date.now();
		this._lastUpdateSnakes = Date.now();
		this._count = 0;
		this._world = new World();
		this._snakes = [];
		this._leaderboard = new Leaderboard();
		this._leaderboardObservers = new Map();

	}

	get world() {
		return this._world;
	}


	startGame() {
		setInterval(this._update.bind(this), config["gameUpdateRate"]);
		setInterval(this._updateSnakes.bind(this), config["snakeUpdateRate"]);
		setInterval(this._updateLeaderboard.bind(this), config["leaderboardUpdateRate"]);
	}


	
	clientClose(id) {
		let snake = this._snakes[id];
		if (snake !== undefined) {
			console.log(id + " removed snake");
			this._removeSnake(id);

		}

		let lo = this._leaderboardObservers.get(id);
		if (lo !== undefined) {
			this._leaderboard.detach(lo);
			this._leaderboardObservers.delete(id);
		}


	}

	_updateSnakes() {
		let now = Date.now();
		let deltaTime = now - this._lastUpdateSnakes;
		this._lastUpdateSnakes = now;


		this._count += 1;
		this._count %= 12;

		this._snakes.forEach(snake => {
			snake.update(deltaTime, this._count);
		});

	}

	_update() {
		let now = Date.now();
		let deltaTime = now - this._lastUpdate;
		this._lastUpdate = now;

		this.detectCollisions();
		
		//this causes too much network data
		//this.emit("minimap",this._snakes);
		
		this._world.update(deltaTime);
	}

	_updateLeaderboard() {
		this._snakes.filter(function (e) {
			return e;
		});
		if (Object.keys(this._snakes).length <= 0) {
			this._leaderboard.setLeaderboard(JSON.stringify([{name: "No one is playing", score: 0}]));
			return;
		}

		let topSnakes = Array.from(this._snakes);

		topSnakes.sort(function (a, b) {
			return b.length - a.length;
		});

		topSnakes = topSnakes.filter(function (e) {
			return e
		});

		this.emit("leaderboard", topSnakes);

		topSnakes.slice(0, 10);

		var cleanSnakes = [];
		for (var i = 0; i < topSnakes.length; i++) {
			cleanSnakes[i] = {name: topSnakes[i].name, score: topSnakes[i].getScore()};
		}

		console.log("snakes count " + Object.keys(this._snakes).length);
		this._leaderboard.setLeaderboard(JSON.stringify(cleanSnakes));

	}


	processMessage(client, data) {
		let firstByte;
		if (data.length === 0) {
			console.log('[SERVER] No Data to handle!');
			return;
		}
		if (data.length === 1) {
			this._snakeMovementMessage(client, data);
		} else {
			firstByte = message.readInt8(0, data);
			if (firstByte === 115) {
				this._newSnakeMessage(client, data);

			} // else if(firstByte === 255){
			// var msg = message.readString(3, data, data.byteLength);
			// send(conn.id, messages.highscore.build(conn.snake.name, msg));
			// delete clients[conn.id];
			// conn.close();
			else if (firstByte === 224) {
				this._newLeaderboardObserver(client, data);

			} else if (firstByte === 252) {
				this._snakeMovementMessage(client, data);
			}
			else {
				console.log("length:" + data.length);
				console.log('[ERROR] Unhandled message ' + firstByte);
				console.log(message.readInt8(0, data));
				console.log(message.readInt8(1, data));
				console.log(message.readInt8(2, data));
			}


			//	send(conn.id, messages.eat())
		}
	}

	///PRIVATE METHODS
	_removeSnake(id) {
		this.emit("snakeRemoved", this._snakes[id]);

		delete this._snakes[id];

	}

	_killSnake(id) {
		this.emit("snakeDied", this._snakes[id]);
		delete this._snakes[id];
	}

	_newLeaderboardObserver(client, data) {
		console.log(client.id + " attached");
		let lo = new LeaderboardObserver(client, client.id);
		this._leaderboardObservers.set(client.id, lo);
		this._leaderboard.attach(lo);
	}

	_snakeMovementMessage(client, data) {
		let radians, speed, value, x, y;
		value = message.readInt8(0, data);
		let snake = this._snakes[client.id];
		if (snake === undefined) return;

		if (value === 251) {
			this.emit("clientPing", client.id);
		} else if (value <= 250) {
			// console.log('Snake going to', value);
			if (snake === undefined) return;

			//256 or 251
			radians = value * 2 * Math.PI / 251;
			snake.setExpectedAngle(radians);

		} else if (value === 252) {
			var value2 = message.readInt8(1, data);
			console.log(value2);
			value2 = value2 - 127;


			if (value2 > 0) {
				radians = value2 * 2 * Math.PI / 256;
				snake.turn(radians);
			}
			else {
				value2 += 127;
				radians = value2 * 2 * Math.PI / 256;
				snake.turn(-radians);
				console.log(radians)

			}

		} else if (value === 253) {
			//console.log('Snake in speed mode');
			snake.setBoost(true);
			//snake.speed *= 3;
		} else if (value === 254) {
			//	console.log('Snake in normal mode');
			//snake.speed = 1.79;
			snake.setBoost(false);
			// killPlayer(conn.id, 1);
			//messages.end.build(2);
		}
	}

	foodCollisions() {
		let foods = this._world.foods;

		for (let i = foods.length - 1; i >= 0; i--) {
			let offset = 35;
			if (this._snakes.length > 0)
				this._snakes.forEach(snake => {
					if(foods[i] !== undefined){
						if (( snake.head.x < (foods[i].position.x + offset) && snake.head.x > (foods[i].position.x - offset)
										&& snake.head.y < (foods[i].position.y + offset) && snake.head.y > (foods[i].position.y - offset))) {

							this.emit("foodEaten", snake, foods[i]);
							snake.increaseSize(foods[i].size);

							//This food is gone remove it
							this._world.foods.splice(i, 1);
						}
					}
				});
		}
	}

	detectCollisions() {
		//TODO Snake Collisions 
		this.snakeCollisions();

		this.foodCollisions();


		//Out of radius detection
		let R = this._world.radius;

		this._snakes.forEach(snake => {
			let r = (Math.pow((snake.head.x - R), 2)) + (Math.pow((snake.head.y - R), 2));

			if (r+30 > Math.pow(R, 2)) {
				console.log("[TEST] " + r + " < " + R ^ 2);
				console.log('[DEBUG] Outside of Radius');
				this._killSnake(snake.id);
			}
		});
	}

	snakeCollisions() {
		this._snakes.forEach(head => {
		
			this.eachSnakeCollision(head);
		});

	}

	eachSnakeCollision(head) {
		var h = head.head;
		this._snakes.forEach(snake => {
			//TODO this offset should be larger for bigger snakes
			let offset = 30;
			if (head !== snake) {
				var p = snake.parts;
				for (var i = 0; i < p.length; i++) {
					if (( h.x < (p[i].x + offset) && h.x > (p[i].x - offset)
									&& h.y < (p[i].y + offset) && h.y > (p[i].y - offset))) {
						this.world.deadSnakeFood(head);
						this._killSnake(head.id);
						return;
					}
				}
			}
		});
	}

	_newSnakeMessage(client, data) {

		let skin = message.readInt8(2, data);
		let name = message.readString(3, data, data.byteLength);
		console.log(skin);
		//TODO random position in world
		//id cooke name color position
		let snake = new Snake(client.id, 'asdf', name, skin, new Position(
				config['gameRadius'],
				config['gameRadius']
		));

		this._snakes[client.id] = snake;

		this.emit('newClientSnake', client, this._snakes, snake, this._world.foods);
		console.log(client.id + " new snake");
		//console.log((snake.name === '' ? '[DEBUG] An unnamed snake' : '[DEBUG] A new snake called ' + snake.name) + ' has connected!');
	}
}


function setMscps(mscps) {
	fmlts = [mscps + 1 + 2048];
	fpsls = [mscps + 1 + 2048];

	for (var i = 0; i <= mscps; i++) {
		fmlts[i] = (i >= mscps ? fmlts[i - 1] : Math.pow(1 - 1.0 * i / mscps, 2.25));
		fpsls[i] = (i === 0 ? 0 : fpsls[i - 1] + 1.0 / fmlts[i - 1]);
	}

	var fmltsFiller = fmlts[mscps];
	var fpslsFiller = fpsls[mscps];

	for (var i = 0; i < 2048; i++) {
		fmlts[mscps + 1 + i] = fmltsFiller;
		fpsls[mscps + 1 + i] = fpslsFiller;
	}
}


module.exports = Game;