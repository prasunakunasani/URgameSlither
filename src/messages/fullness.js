var message = require('../utils/message');

var type = 'h'.charCodeAt(0);

exports.build = function (snake) {
	var arr = new Uint8Array(8);
	message.writeInt8(2, arr, type);
	message.writeInt16(3, arr, snake.id);
	message.writeInt24(5, arr, snake._fam * 16777215);

	return arr;
};
