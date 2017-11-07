var Observer = require('./observer');
var Leaderboard = require('../subjects/leaderboard');

class LeaderboardObserver extends Observer{
	
	constructor(conn, id){
		super(conn,id);
	}
	
	update(leaderboard){
		if( Object.keys(leaderboard.leaders).length === 0){
			this.conn.send(JSON.stringify("no players"));
			return;
		}
			
		var b = [];
		leaderboard.leaders.forEach(function(key, index){
			b.push({name: key.snake.name, length: key.snake.length});
		});

		this.conn.send(JSON.stringify(b));
	}
}

module.exports = LeaderboardObserver;