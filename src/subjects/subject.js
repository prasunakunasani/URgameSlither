

class Subject{
	
	constructor(){
		if (new.target === Subject) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		this.observers = [];
	}
	
	register(observer){
		this.observers[observer.id] = observer;
	}
	
	unregister(observer){
		delete this.observers[observer.id];
	}
	
	notifyObservers(){
		this.observers.forEach(observer =>{
			observer.update(this);
		})
	}
}

module.exports = Subject;