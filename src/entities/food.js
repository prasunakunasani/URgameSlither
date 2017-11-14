const Position = require("./position");

class Food {

	constructor(id, position, size, color) {
		this.id = id;
		this.position = new Position(position.x, position.y);
		this.size = size;
		this.color = color;
	}

}

module.exports = Food;