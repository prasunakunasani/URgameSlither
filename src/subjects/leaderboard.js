const Subject = require("./subject");

class Leaderboard extends Subject {

	constructor() {
		super();
		this._leaderboard = "";
	}

	attach(observer) {
		super.attach(observer);
		console.log("registered to leaderboard");
	}

	detach(observer) {
		let success = super.detach(observer);
		if (success)
			console.log("unregistered from leaderboard");
	}

	getLeaderboard() {
		return this._leaderboard;
	}

	setLeaderboard(leaderboard) {
		this._leaderboard = leaderboard;
		this.notifyObservers();
	}

}

module.exports = Leaderboard;