const message = require('../utils/message');
const config = require('../../config/config.js');

const messageCode = 'e'.charCodeAt(0);

exports.build = function (snake) {
	var arr;
	
	if(snake.direction.angle == snake.direction.expectedAngle) {
		if (snake.speed == config["baseSpeed"]) {
			//TODO need to check if client is at base speed before doing smallest packet
			arr = new Uint8Array(6);
			message.writeInt8(2, arr, messageCode);
			message.writeInt16(3, arr, snake.id);
			message.writeInt8(5, arr, snake.direction.angle * 255 / (2 * Math.PI));
			//message.writeInt8(6, arr, snake.speed * 18);
		} else {
			arr = new Uint8Array(7);
			message.writeInt8(2, arr, messageCode);
			message.writeInt16(3, arr, snake.id);
			message.writeInt8(5, arr, snake.direction.angle * 255 / (2 * Math.PI));
			message.writeInt8(6, arr, snake.speed * 18);
		}
	}else{
		arr = new Uint8Array(8);
		message.writeInt8(2, arr, messageCode);
		message.writeInt16(3, arr, snake.id);
		message.writeInt8(5, arr, snake.direction.angle * 255 / (2 * Math.PI));
		message.writeInt8(6, arr, snake.direction.expectedAngle * 255 / (2 * Math.PI));
		message.writeInt8(7, arr, snake.speed *18);
	}

	arr = new Uint8Array(8);
	message.writeInt8(2, arr, messageCode);
	message.writeInt16(3, arr, snake.id);
	message.writeInt8(5, arr, (snake.direction.angle) * 255 / (2 * Math.PI));
	message.writeInt8(6, arr, (snake.direction.angle) * 255 / (2 * Math.PI));
	message.writeInt8(7, arr, snake.speed *18);
	
	
	return arr;
	};

