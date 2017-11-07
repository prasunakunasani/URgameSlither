var message = require('../utils/message');

var math = require('../utils/math');

var type = 'l'.charCodeAt(0);

exports.build = function (rank, players, top) {
	var arr;
    var length = 0;
    top.forEach(player =>{
        "use strict";
        length += player.snake.name.length;
    });

    
    var sorted = top.slice(0).sort(function(a,b){
        "use strict";
        return a.snake.length - b.snake.length;
    })
    arr = new Uint8Array((8 + length) + (Object.keys(sorted).length * 7));
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt8(b, arr, rank > 10 ? 0 : rank);
    b += message.writeInt16(b, arr, 1);
    b += message.writeInt16(b, arr, players);
    i = 0;
    sorted.forEach(function(key,index){
        "use strict";
      //length formula
      //Math.floor(15 * (fpsls[K] + u / fmlts[K] - 1) - 5) / 1
			b += message.writeInt16(b, arr, key.snake.sct);
			b += message.writeInt24(b, arr, key.snake.fam);
			b += message.writeInt8(b, arr, math.randomInt(0, 8));
			b += message.writeInt8(b, arr, key.snake.name.length);
			b += message.writeString(b, arr, key.snake.name);
    });
        
        
   
    
    return arr;
};
