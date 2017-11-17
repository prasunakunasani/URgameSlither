var c = {
	port: 8080,
	path: '/game/socket',
	bots: 0, // Not Implemented
	maxConnections: 20,
	highscoreName: "How to change Highscore Msg",
	highscoreMsg: "Set this message in the config",
	food: 1000,
	maxFoodColors: 8,
	minFoodSize: 25,
	maxFoodSize: 75,
	foodPerSpawn: 1000, // Not Implemented
	gameRadius: 2000,//21600,
	sectorSize: 300,
	gameUpdateRate: 40,
	snakeUpdateRate: 15,
	leaderboardUpdateRate: 4000,
	worldUpdateRate: 5000,
	dataUpdateRate: 1000,
	nsp1: 5.39,
	nsp2: 0.4,
	maxSpeed: 12,
	snakeStartSize: 2,
	spangdv: 4.8,
	foodToGrow: 200,
	speedMult: 1,
	speedBonus: 0,
	//5 seconds
	intervalRate: 5000
};


(function setMscps(mscps ) {
	 mscps || (mscps = 411);
	fmlts = [mscps + 1 + 2048];
	fpsls = [mscps + 1 + 2048];

	for (var i = 0; i <= mscps; i++) {
		fmlts[i] = (i >= mscps ? fmlts[i - 1] : Math.pow(1 - 1.0 * i / mscps, 2.25));
		fpsls[i] = (i === 0 ? 0 : fpsls[i - 1] + 1.0 / fmlts[i - 1]);
	}

	var fmltsFiller = fmlts[mscps];
	var fpslsFiller = fpsls[mscps];

	for (var i = 0; i < 2048; i++) {
		fmlts[mscps + 1 + i] = fmltsFiller;
		fpsls[mscps + 1 + i] = fpslsFiller;
	}
	c["fpsls"] = fpsls;
	c["fmlts"] = fmlts;
})();

module.exports = c;