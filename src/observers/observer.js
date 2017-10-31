

var ws = require('ws');


class Observer
{
	
	constructor(conn,id){
		if (new.target === Observer) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		this._id = id;
		this._conn = conn;
	}
	
	get id(){
		return this._id;
	}
	
	get conn(){
		return this._conn;
	}
	
	update(){};
	
}

module.exports = Observer;