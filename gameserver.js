/*eslint-disable no-unused-vars */ // disabled some codes are stubs

var config = require('./config/config.js');
// var spawn = require("./src/spawn.js");
var pkg = require('./package.json');
var WebSocket = require('ws').Server;
var Snake = require('./src/entities/snake');
var Food = require('./src/entities/food');
var sector = require('./src/entities/sector');
var messages = require('./src/messages');
var message = require('./src/utils/message');
var math = require('./src/utils/math');
var Leaderboard = require('./src/subjects/leaderboard');
var LeaderboardObserver = require('./src/observers/leaderboardObserver');
var MessageService = require('./src/messages/messageService');

var loopInterval = 230;
var counter = 0;
var clients = [];
var foods = [];
var sectors = []; // Development Code
var botCount = 0;
var highscoreName = config["highscoreName"];
var highscoreMessage = config["highscoreMsg"];
var fmlts;
var fpsls;


var leaderboard = new Leaderboard();
console.log('[DEBUG] You are currently running on ' + pkg.version);
console.log('[SERVER] Starting Server...');
var server;
server = new WebSocket({port: config['port'], path: '/game/socket'}, function () {
	console.log('[SERVER] Server Started at 127.0.0.1:' + config['port'] + '! Waiting for Connections...');
	console.log("[BOTS] Bot Status: Bot's are currently unavailable! Please try again later.");
	//console.log('[BOTS] Creating ' + config['bots'] + ' bots!');
	//console.log('[BOTS] Bots successfully loaded: ' + botCount + (botCount === 0 ? "\n[BOTS] Reason: Bot's aren't implemented yet. Please try again later" : ''));
	generateFood(config['food']);
	generateSectors();
	setInterval(function(){
		"use strict";
		updateLeaderboard();

	},2000);
});
/* server.on('error', function() {
 console.log('[DEBUG] Error while connecting!');
});
console.log("[SERVER] Server Started at 127.0.0.1:" + config["port"] + "! Waiting for Connections...");
 */
if (server.readyState === server.OPEN) {
	server.on('connection', handleConnection.bind(server));
} else {
	console.log(server.readyState);
}

function handleConnection(conn) {
	if (clients.length >= config['max-connections']) {
		console.log('[SERVER] Too many connections. Closing newest connections!');
		conn.close();
		return;
	}
	try {
		conn.id = ++counter;
		conn.type = 'player';
		clients[conn.id] = conn;
	} catch (e) {
		console.log('[ERROR] ' + e);
	}
	conn.on('message', handleMessage.bind(this, conn));
	conn.on('error', close.bind(conn.id));
	conn.on('close', function () {
		console.log('[DEBUG] Connection closed.');
		messages.end.build(2);
		if(conn.type === 'player'){
			clearInterval(conn.snake.update);
			delete clients[conn.id];
		}else {
			leaderboard.unregisterById(conn.id);
		}

	});
}

function handleMessage(conn, data) {
	var firstByte, name, radians, secondByte, skin, speed, value, x, y;
	if (data.length === 0) {
		console.log('[SERVER] No Data to handle!');
		return;
	}
	if (data.length >= 227) {
		console.log('[SERVER] Data length less than 227!');
		conn.close();
	} else if (data.length === 1) {
		value = message.readInt8(0, data);
		if (value <= 250) {
			// console.log('Snake going to', value);
			if (value === conn.snake.direction.angle) {
				console.log('[DEBUG] Angle is equal to last');
				return;
			}


			radians = value * 2 * Math.PI / 256;
			var degree = value * 360 / 250;


			speed = conn.snake.speed;
			x = Math.cos(radians) + 1;
			y = Math.sin(radians) + 1;
			conn.snake.direction.x = x * 127 * speed;
			conn.snake.direction.y = y * 127 * speed;
			conn.snake.direction.angle = radians;
		} else if (value === 253) {
			console.log('Snake in speed mode');
			conn.snake.speed *= 3;
		} else if (value === 254) {
			console.log('Snake in normal mode');
			conn.snake.speed = 1.79;
			// killPlayer(conn.id, 1);
			//messages.end.build(2);
		} else if (value === 251) {
			send(conn.id, messages.pong);
		}
	} else {
		firstByte = message.readInt8(0, data);
		secondByte = message.readInt8(1, data);
		if (firstByte === 115) {
			// setMscps(411);
			skin = message.readInt8(2, data);
			name = message.readString(3, data, data.byteLength);
			conn.snake = new Snake(conn.id, name, {
				x: config['gameRadius'],
				y: config['gameRadius']
			}, skin);
			conn.type = 'player';
			send(conn.id, messages.initial);
			send(conn.id, messages.food.build(foods));
			broadcast(messages.snake.build(conn.snake));

			console.log((conn.snake.name === '' ? '[DEBUG] An unnamed snake' : '[DEBUG] A new snake called ' + conn.snake.name) + ' has connected!');
			spawnSnakes(conn.id);
			conn.snake.update = setInterval(function () {
				var distance = conn.snake.speed * loopInterval / 8;
				conn.snake.body.x += Math.cos(conn.snake.direction.angle) * distance;
				conn.snake.body.y += Math.sin(conn.snake.direction.angle) * distance;
				var id = conn.snake.body.y * config['gameRadius'] * 3 + conn.snake.body.x;
				var bad = [];
				var eatenFood = foods.filter(food => {
					"use strict";
					if (!( conn.snake.head.x < (food.position.x + 50) && conn.snake.head.x > (food.position.x - 50)
									&& conn.snake.head.y < (food.position.y + 50) && conn.snake.head.y > (food.position.y - 50))) {
						bad.push(food);
					} else {
						return true;
					}
				});
				foods = bad;

				eatenFood.forEach(food => {
					"use strict";


					conn.snake.fam += 1;
					conn.snake.fam *= 2;
					conn.snake.length += food.size;
					broadcast(messages.eat.build(food.position.x, food.position.y, conn.snake.id));

					console.log(conn.snake.fam);
					if (conn.snake.fam / 16777215 >= 1) {
						conn.snake.fam = 16777215;
						var newparts = conn.snake.parts[conn.snake.parts.length - 1];
						conn.snake.parts.push(newparts);
						conn.snake.sct++;
						broadcast(messages.increase.build(conn.snake));
						conn.snake.fam = 0;
					}
				});

				var R = config['gameRadius'];
				var r = (Math.pow((conn.snake.body.x - R), 2)) + (Math.pow((conn.snake.body.y - R), 2));
				if (r > Math.pow(R, 2)) {
					// console.log("[TEST] " + r + " < " + R^2);
					console.log('[DEBUG] Outside of Radius');
					var arr = new Uint8Array(6);
					message.writeInt8(2, arr, "s".charCodeAt(0));
					message.writeInt16(3, arr, conn.id);
					message.writeInt8(5, arr, 1);
					broadcast(arr);
					broadcast(messages.end.build(0));
					//sleep(1000);
					delete clients[conn.id];
					conn.close();
				}

				send(conn.id, messages.leaderboard.build([conn], Object.keys(clients).length, clients));
				broadcast(messages.position.build(conn.id, conn.snake));
				//broadcast(messages.direction.build(conn.id, conn.snake));
				broadcast(MessageService.direction.build(conn.id, conn.snake));
				//broadcast(messages.movement.build(conn.id, conn.snake));
			}, loopInterval);
		} // else if(firstByte === 255){
		// var msg = message.readString(3, data, data.byteLength);
		// send(conn.id, messages.highscore.build(conn.snake.name, msg));
		// delete clients[conn.id];
		// conn.close();
		else if (firstByte == 224) {
			delete clients[conn.id];
			leaderboard.register(new LeaderboardObserver(conn,conn.id));
			conn.type = 'observer';
		} else {
			console.log("length:" + data.length);
			console.log('[ERROR] Unhandled message ' + firstByte);
			console.log(message.readInt8(0, data));
			console.log(message.readInt8(1, data));
			console.log(message.readInt8(2, data));
		}
		if(conn.type === 'player'){
			//This sends leaderboard and local score
			send(conn.id, messages.leaderboard.build([conn], Object.keys(clients).length, clients));
			send(conn.id, messages.highscore.build(highscoreName, highscoreMessage));
			send(conn.id, messages.minimap.build(foods));
		}

		//	send(conn.id, messages.eat())
	}
}

function generateFood(amount) {
	var color, i, id, results, size, x, y;
	i = 0;
	results = [];
	while (i < amount) {
		x = math.randomInt(0.5 * config["gameRadius"], 1.5 * config["gameRadius"]);
		y = math.randomInt(0.5 * config["gameRadius"], 1.5 * config["gameRadius"]);
		id = (y * config['gameRadius'] * 3) + x;
		color = math.randomInt(0, config['foodColors']);
		size = math.randomInt(config['foodSize'][0], config['foodSize'][1]);

		var f = new Food(id, {
			x: x,
			y: y
		}, size, color);
		foods.push(f);
		results.push(i++);
	}


	return results;
}

function generateSectors() {
	var i, results, sectorsAmount;
	sectorsAmount = config['gameRadius'] / config['sectorSize'];
	i = 0;
	results = [];
	while (i < sectorsAmount) {
		results.push(i++);
	}
	return results;
}

function spawnSnakes(id) {
	clients.forEach(function (newClient) {
		if (newClient.id !== id) {
			send(id, messages.snake.build(newClient.snake));
		}
	});
}

function send(id, data) {
	var client = clients[id];
	if (client/* && client.readyState == client.OPEN */) {
		var currentTime = Date.now();
		var deltaTime = client.lastTime ? currentTime - client.lastTime : 0;
		client.lastTime = currentTime;
		message.writeInt16(0, data, deltaTime);
		client.send(data, {binary: true});
	}
}

function broadcast(data) {

	for (var i = 0; i < clients.length; i++) {
		send(i, data);
	}
	// clients.forEach(client =>{
	// 	"use strict";
	// 	send(client.id, data);
	// })
}

function killPlayer(playerId, endType) {
	broadcast(messages.end.build(endType));
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

function close() {
	console.log('[SERVER] Server Closed');
	server.close();
}


function updateLeaderboard(){
	if(Object.keys(clients).length === 0){
		leaderboard.setLeaderboard([]);
		return;
	}


	var leaders = clients.filter(function(client){
		return client.snake !== 'undefined';
	})
	"use strict";
	leaders = Array.prototype.slice.call(leaders).sort(function(a,b){
		"use strict";
		
		return a.snake.length - b.snake.length;
	});
	
	leaders = leaders.slice(0,10);
	
	leaderboard.setLeaderboard(leaders);
}