const config = require('../../config/config.js');
const math = require('../utils/math');
const EventEmitter = require('events');
const Food = require ("./food");
const Position = require ("./position");


class World extends EventEmitter {

	constructor() {
		super();
		this._foods = [];
		this._snakes = new Map();
		this._radius = config["gameRadius"]
		this._minFoodSize = config['minFoodSize'];
		this._maxFoodSize = config['maxFoodSize'];
		this._maxFoodColors = config['maxFoodColors'];
		this._generateFood(config['food']);
	}

	get foods(){
		return this._foods;
	}
	
	get radius() {
		return this._radius;
	}

	update(deltaTime){
		
		//todo add food
		this.emit("newFood", this._foods);
		//emit food added
	}
	
	//Private functions
	_generateFood (amount) {
		for (let i = 0; i < amount; i++) {
			let a = math.randomSpawnPoint();
			let pos = new Position(a.x,a.y);
	
			
			let id = (pos.y * this.radius * 3) + pos.x;
			let color = math.randomInt(0, this._maxFoodColors);
			let size = math.randomInt(this._minFoodSize, this._maxFoodSize);

			let f = new Food(id, pos, size, color);
			this._foods.push(f);
		}

	}

	generateSectors() {
		var i, results, sectorsAmount;
		sectorsAmount = config['gameRadius'] / config['sectorSize'];
		i = 0;
		results = [];
		while (i < sectorsAmount) {
			results.push(i++);
		}
		return results;
	}
}

module.exports = World;
