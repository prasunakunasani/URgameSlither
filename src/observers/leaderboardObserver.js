const Observer = require("./observer");
const Leaderboard = require("../subjects/leaderboard");

class LeaderboardObserver extends Observer{
	
	constructor(client, id, leaderboard){
		super(client,id);
		this._leaderboard = null;
		leaderboard.attach(this);
	}
	
	update(leaderboard){
		this._leaderboard  = leaderboard.getState();

		if(this._client.readyState == 1 )
			this._client.send(this._leaderboard);
	}
}

module.exports = LeaderboardObserver;
