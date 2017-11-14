
class Observer
{
	
	constructor(client,id){
		if (new.target === Observer) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		this._id = id;
		this._client = client;
	}
	
	get id(){
		return this._id;
	}
	
	get conn(){
		return this._client;
	}
	
	update(){};
	
}

module.exports = Observer;