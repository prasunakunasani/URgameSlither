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
		console.log("trying to detach from leaderboard");
		let success = super.detach(observer);
		if (success)
			console.log("unregistered from leaderboard");
	}

	getState() {
		return this._leaderboard;
	}

	setState(leaderboard) {
		this._leaderboard = leaderboard;
		this.notifyObservers();
	}

}

module.exports = Leaderboard;