// TODO? unused for now
 var message = require('../utils/message');
var config = require('../../config/config');

var type = 'u'.charCodeAt(0);

exports.build = function (foods) {
 

	var radius =  config["gameRadius"];

	var b = new Array(80);
	
	for(var i = 0; i < 80; i++){
	    b[i] = new Array(80);
	    for (var j = 0; j < 80; j++){
	       b[i][j] = 0; 
      }
  }
	
  for(var f in foods){
	    var food = foods[f];
	    var i = Math.floor(food.position.x * 79 / (2*radius));
	    if(i > 80) i = 80;
	    var j = Math.floor(food.position.y * 79 / (2*radius)) ;
	    if(j > 80) j = 80;
	    b[i][j] = 1;
  }

  var num = 0;
  var count = 0;
  var m = [];
	for(var i = 0; i < 80; i++){
		for (var j = 0; j < 80; j++) {
		    count++;
		    if(b[i][j])
					num = (num << 1) + 1;
				
		    if(count >= 7){
		        m.push(num);
		        count = 0;
		        num = 0;
        }
		}
  }
  if(count > 0)
    m.push(num);
	var arr = new Uint8Array(3 + m.length);
	arr.set([0, 0, type]);
	arr.set(m,3);
	
    return arr;
};
