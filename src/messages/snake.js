var message = require('../utils/message.js');
var type = 's'.charCodeAt(0);

exports.build = function (snake) {
    var nameLength = snake.name.length;
    var part = snake.parts.length;
    var partsLength = part * 2;
    var arr = new Uint8Array(25 + nameLength + 6 + partsLength);
    var b = 0;
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, 0);
    b += message.writeInt8(b, arr, type);
    b += message.writeInt16(b, arr, snake.id);
    //Was D
    //b += message.writeInt24(b, arr, snake.D);
     b += message.writeInt24(b, arr, (snake.direction.angle / snake.direction.expectedAngle) * 16777215);
    b += message.writeInt8(b, arr, 0);
    //Was X
    //	b += message.writeInt24(b, arr, (snake.X) );
     b += message.writeInt24(b, arr, (snake.direction.angle / snake.direction.expectedAngle) * 16777215);
    b += message.writeInt16(b, arr, snake.speed * 1E3);
    b += message.writeInt24(b, arr, 0);
    b += message.writeInt8(b, arr, snake.skin);
    b += message.writeInt24(b, arr, snake.head.x * 5);
    b += message.writeInt24(b, arr, snake.head.y * 5);
    b += message.writeInt8(b, arr, nameLength);
    b += message.writeString(b, arr, snake.name);
    b += message.writeInt24(b, arr, snake.body.x * 5);
    b += message.writeInt24(b, arr, snake.body.y * 5);
    
    prevX = snake.body.x;
    prevY = snake.body.y;
    console.log(snake.parts);
 
    for  ( var i = 0; i < part ; i++) {
        thisX = snake.parts[i].x;
        thisY = snake.parts[i].y;
        b += message.writeInt8(b, arr, (thisX-prevX)*2 + 127);
        b += message.writeInt8(b, arr, (thisY-prevY)*2 + 127);
        prevX = thisX;
        prevY = thisY;

    }
    return arr;
};
