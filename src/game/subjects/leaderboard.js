const Subject = require("./subject");

class Leaderboard extends Subject {

	constructor() {
		super();
		this._leaderboard = "";
	}

	attach(observer) {
		super.attach(observer);

	}

	detach(observer) {
		super.detach(observer);
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