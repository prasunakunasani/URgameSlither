
class Food {
	constructor(id, position, size, color) {
		this._id = id;
		this._position = position;
		this._size = size;
		this._color = color;
	}

	
	//GETTERS
	get id() {
		return this._id;
	}

	get position() {
		return this._position;
	}

	get color() {
		return this._color;
	}
	get size() {
		return this._size;
	}
}

module.exports = Food;