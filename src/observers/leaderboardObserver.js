const Observer = require("./observer");
const Leaderboard = require("../subjects/leaderboard");

class LeaderboardObserver extends Observer{
	
	constructor(client, id){
		super(client,id);
	}
	
	update(leaderboard){
		var s = leaderboard.getLeaderboard();

		if(this._client.readyState == 1 )
			this._client.send(s);
	}
}

module.exports = LeaderboardObserver;
