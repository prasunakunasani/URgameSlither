const ClientType = Object.freeze({
	PLAYER: Symbol('PLAYER'),
	LEADERBOARD_OBSERVER: Symbol('LEADERBOARD_OBSERVER'),
	CONNECTING: Symbol('CONNECTING')
});

class Client{
	
	constructor(ws, type){
		this._id = Client.counter;
		this._conn = ws;
		this._type = type;
	}
	
	get conn(){
		return this._conn;
	}
	
	get type(){
		return this._type;
	}
	
	set type(type){
		this._type = type;
	}
	
	static get counter() {
		Client._counter = (Client._counter || 0) + 1;
		return Client._counter;
	}
	
}