const Game = require("./entities/game");
const NetworkSystem = require("./networksystem");

const WebSocket = require('ws');
let config = require('../config/config.js');

//const messages = require('messages');

class GameServer {

	constructor() {

		this._clients = [];
		this._game = new Game();
		this._networkSystem = new NetworkSystem(this._game, this._game.world);
	}

	startServer() {
		this._game.startGame();
		this._server = new WebSocket.Server({port: config['port'], path: config['path']}, function () {
			console.log('[SERVER] Server Started at 127.0.0.1:' + config['port'] + '! Waiting for Connections...');
			//console.log("[BOTS] Bot Status: Bot's are currently unavailable! Please try again later.");
			//console.log('[BOTS] Creating ' + config['bots'] + ' bots!');
			//console.log('[BOTS] Bots successfully loaded: ' + botCount + (botCount === 0 ? "\n[BOTS] Reason: Bot's aren't implemented yet. Please try again later" : ''));
		});

		if (this._server.readyState === this._server.OPEN) {
			this._server.on('connection', this.onConnection.bind(this));
		} else {
			console.log(this._server.readyState);
		}
	}


	onConnection(client) {
		GameServer._counter = (GameServer._counter || 1);
		if (this._clients.length >= config['max-connections']) {
			console.log('[SERVER] Too many connections. Closing newest connections!');
			client.close();
			return;
		}
		try {
			client.id = ++GameServer._counter;
			this._clients[client.id] = client;
		} catch (e) {
			console.log('[ERROR] ' + e);
		}
		client.on('message', this.onMessage.bind(this,client));
		client.on('error', this.onError.bind(this));
		client.on('close', this.onClose.bind(this, client));
	}

	onMessage(client, data) {
		this._game.processMessage(client, data);
	}

	onClose(client) {
		console.log(client.id + " closing client");
		console.log('[DEBUG] Connection closed.');
		this._game.clientClose(client.id);
		delete this._clients[client.id];
	}
	
	onError(e){
		console.error(e)
	}
}



module.exports = GameServer;