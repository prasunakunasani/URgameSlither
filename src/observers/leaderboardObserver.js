const Observer = require("./observer");
const Leaderboard = require("../subjects/leaderboard");

class LeaderboardObserver extends Observer{
	
	constructor(client, id){
		super(client,id);
	}
	
	update(leaderboard){
		if( Object.keys(leaderboard.leaders).length === 0){
			this.client.send(JSON.stringify("no players"));
			return;
		}
			
		var b = [];
		leaderboard.leaders.forEach(function(key, index){
			b.push({name: key.snake.name, length: key.snake.length});
		});

		this.client.send(JSON.stringify(b));
	}
}

module.exports = LeaderboardObserver;
