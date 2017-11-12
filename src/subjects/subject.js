class Subject{
	
	constructor(){
		if (new.target === Subject) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		this._observers = [];
	}
	
	attach(observer){
		this._observers.push(observer);
		this.notifyObservers();
	}
	
	detach(observer){
		this._observers.forEach((o,i) =>{
			if(o === observer){
				this._observers.splice(i,1);
				return true;
			}
		});
		return false;
	}
	
	notifyObservers(){
		this._observers.forEach(observer =>{
			observer.update(this);
		})
	}
}

module.exports = Subject;