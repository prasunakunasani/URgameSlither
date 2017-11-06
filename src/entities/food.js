module.exports = Food;
const Position = require('./position');


function Food(id, position, size, color){
        this.id = id;
        this.position = new Position(position.x, position.y);
        this.size = size;
        this.color = color;
}

