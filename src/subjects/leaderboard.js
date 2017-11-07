
const Subject = require('./subject');

class Leaderboard extends Subject{
        
	constructor() {
		super();
		this.leaders = [];
	}
	register(observer){
		super.register(observer);
		console.log("registered to leaderboard");
	}
	
	unregisterById(id){
		if(this.observers[id] !== 'undefined'){
			console.log("unregistered from leaderboard");
			delete this.observers[id];
		}
	}
	
	setLeaderboard(leaders){
		this.leaders = leaders;
		this.notifyObservers();
	}
	
}



module.exports = Leaderboard;