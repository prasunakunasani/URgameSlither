const config = require('../../config/config.js');
const math = require('../utils/math');
const EventEmitter = require('events');
const Food = require ("./food");


class World extends EventEmitter {

	constructor() {
		super();
		this._foods = [];
		this._snakes = new Map();
		this._radius = config["gameRadius"]
		this._minFoodSize = config['minFoodSize'];
		this._maxFoodSize = config['maxFoodSize'];
		this._maxFoodColors = config['maxFoodColors'];
		this._maxFood = config['food'];
		this._generateFood(config['food']);
	}

	get foods(){
		return this._foods;
	}
	
	get radius() {
		return this._radius;
	}

	update(){
		var diff = this._maxFood -this._foods.length ;
		
		if(diff > 0){
			var newFoods = this._generateFood(diff);
			this.emit("newFoods", newFoods);
		}
		
	}

	_newFoodAt(x,y,size,color){
		let id = (y * this.radius * 3) + x;
		let f = new Food(id, {x,y}, size, color);
		this._foods.push(f);
		return f;
	}

	deadSnakeFood(snake){
		var newFoods = [];
		for(var i = 0; i < snake.parts.length; i++){
			var f = this._newFoodAt(snake.parts[i].x, snake.parts[i].y, 110, snake.skin);
			newFoods.push(f);
		}
		this.emit("newFoods", newFoods);
	}


	//Private functions
	_generateFood (amount) {
		var newFoods = [];
		for (let i = 0; i < amount; i++) {
			let a = math.randomSpawnPoint();
			let pos = {x:a.x,y:a.y};
			let id = (pos.y * this.radius * 3) + pos.x;
			let color = math.randomInt(0, this._maxFoodColors);
			let size = math.randomInt(this._minFoodSize, this._maxFoodSize);

			let f = new Food(id, pos, size, color);
			this._foods.push(f);
			 newFoods.push(f);

		}
		return newFoods;
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
