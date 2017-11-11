const message = require('../utils/message');

const messageCode = 'e'.charCodeAt(0);

exports.build = function (snake) {
		var arr = new Uint8Array(8);
		message.writeInt8(2, arr, messageCode);
		message.writeInt16(3, arr, snake.id);
		message.writeInt8(5, arr, snake.direction.angle * 256 / (2 * Math.PI));
		message.writeInt8(6, arr, snake.direction.angle * 256 / (2 * Math.PI));
		message.writeInt8(7, arr, snake.speed * 18);
		return arr;
	};

