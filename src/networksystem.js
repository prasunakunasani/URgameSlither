const messages = require('./messages');
const message = require('./utils/message');


//This class manages sending the clients the correct game information over the network
//It subscribes to entities to know when events occur that need to be relayed to the clients
class NetworkSystem {

	constructor(game, world) {
		this._clients = new Map();

		world.on('newFoods', this._newFood.bind(this));
		//game.on('snakeCollision', this._snakeCollision(snake));
		game.on('newClientSnake', this._newClientSnake.bind(this));
		game.on('snakeDied', this._snakeDied.bind(this));
		game.on('snakeRemoved', this._snakeRemoved.bind(this));
		game.on('clientPing', this._clientPing.bind(this));
		game.on('foodEaten', this._foodEaten.bind(this));
		game.on('leaderboard', this._leaderboard.bind(this));
		game.on('highscore', this._highscore.bind(this));
		game.on('minimap', this._minimap.bind(this));

	}

	addClient(id, client) {
		this._clients.set(id, client);
	}

	removeClient(id) {
		this._clients.delete(id);
	}


//Private Methods
	_send(id, data) {
		let client = this._clients.get(id);
		//console.log(data[2]);
		if (client && client.readyState == client.OPEN) {
			data = this._timestampMessage(client, data);
			client.send(data, {binary: true});
		}
	}

	_broadcast(message) {
		this._clients.forEach(client => {
			this._send(client.id, message)
		});
	}

	_minimap() {
		this._broadcast(messages.minimap.build(foods));
	}

	_highscore(name, message) {
		this._broadcast(messages.highscore.build(name, message));
	}

	_leaderboard(topSnakes) {
		for (var i = 0; i < topSnakes.length; i++) {
			this._send(topSnakes[i].id, messages.leaderboard.build(i + 1, topSnakes.length, topSnakes))
		}

	}

	_foodEaten(snake, food) {
		this._broadcast(messages.eat.build(food.position.x, food.position.y, snake.id));
	}

	_clientPing(id) {
		this._send(id, messages.pong);
	}

	_snakeRemoved(id) {
		this._send(id, messages.end.build(2));
		this.removeClient(id);
	}

	_snakeDied(snake) {
		this._broadcast(messages.removeSnake.build(snake, true));
		this._send(snake.id, messages.end.build(0));
		this.removeClient(snake.id);
	}


	_newClientSnake(client, snake, foods) {
		console.log("new snake");
		this.addClient(client.id, client);

		snake.on('update', this._snakeUpdate.bind(this));
		snake.on('increase', this._snakeIncrease.bind(this));
		snake.on('decrease', this._snakeDecrease.bind(this));
		snake.on('fam', this._snakeFam.bind(this));

		this._send(client.id, messages.initial);
		this._send(client.id, messages.food.build(foods));


		this._broadcast(messages.snake.build(snake));
		//	this._broadcast(messages.snake.build(snake));
	}


	_snakeFam(snake) {
		this._broadcast(messages.fullness.build(snake));
	}

	_snakeCollision(snake) {
		//this._broadcast(messages.end.build(0));
	}

	_newFood(foods) {
		this._broadcast(messages.food.build(foods))
	}

	_snakeUpdate(snake) {
		this._broadcast(messages.position.build(snake))
		this._broadcast(messages.direction.build(snake));

	}

	_snakeDecrease(snake) {
		this._broadcast(messages.decrease.build(snake));
	}

	_snakeIncrease(snake) {
		this._broadcast(messages.increase.build(snake));
	}

	_timestampMessage(client, data) {
		let currentTime = Date.now();
		let deltaTime = client.lastTime ? currentTime - client.lastTime : 0;
		client.lastTime = currentTime;
		message.writeInt16(0, data, deltaTime);
		return data;
	}


}

module.exports = NetworkSystem;