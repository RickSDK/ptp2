function gameFromLine(line) {
	var game = new Object();
	line = line.replace("[nl]", "\n");
	var components = line.split("|");
	if (components.length > 10) {
		game.start = components[0];
		game.end = components[1];
		game.startDate = convertStringToDate(components[0]);
		game.endDate = convertStringToDate(components[1]);
		game.startTime = oracleDateStampFromDate(game.startDate);
		game.endTime = oracleDateStampFromDate(game.endDate);
		//hours
		game.buyin = parseInt(components[3]);
		game.rebuyAmount = parseInt(components[4]);
		game.food = parseInt(components[5]);
		game.cashout = parseInt(components[6]);
		//profit
		//name
		game.gameType = components[9];
		game.stakes = components[10];
		game.limitType = components[11];
		game.limit = components[11];
		game.location = components[12];
		game.bankroll = components[13];
		game.rebuys = parseInt(components[14]);
		game.notes = components[15];
		if (game.notes.length == 1)
			game.notes = '';
		game.breakMinutes = parseInt(components[16]);
		game.tips = parseInt(components[17]);
		//min
		//year
		game.type = components[20];
		//game.tournyFlag = (components[20] == 'Tournament');
		game.status = components[21];
		game.tournamentType = components[22];
		game.tournamentSpots = numberVal(components[29]);
		game.tournamentFinish = numberVal(components[30]);
		game.tournamentPaid = numberVal(components[32]);
	}
	return game;
}

function scrubGameAndCalculateProfit(game) {
	game.localStartTime = localTimeFromStamp(game.startTime);
	game.localEndTime = localTimeFromStamp(game.endTime);
	game.ptpStartTime = ptpTimeFromStamp(game.startTime);
	game.ptpEndTime = ptpTimeFromStamp(game.endTime);
	game.totalMinutes = minutesBetween2DateStamps(game.startTime, game.endTime);
	game.breakMinutes = game.breakMinutes || 0;
	game.minutes = game.totalMinutes - game.breakMinutes;


	game.hours = (game.minutes / 60).toFixed(1);
	var dateSt = new Date(game.startTime);
	game.year = dateSt.getFullYear();
	game.monthNum = (dateSt.getMonth() + 1);
	game.month = monthName(dateSt);

	if (game.type == 'Cash' && !game.stakes && game.tournamentType)
		game.type = 'Tournament'; // fix export error

	game.name = game.gameType + ' ' + game.stakes + ' ' + game.limit;
	if (game.type == 'Tournament')
		game.name = game.gameType + ' ' + game.limit;
	game.rebuyAmount = game.rebuyAmount || 0;
	game.risked = game.buyin + game.rebuyAmount;
	game.profit = game.cashout + game.food - game.risked;
	game.hourly = '-';
	if (game.minutes > 0) {
		var hourly = Math.round(game.profit * 60 / game.minutes);
		game.hourly = formatNumberToLocalCurrency(hourly) + '/hr';
	}
	game.weekday = weekdayOfDate(game.startTime);
	game.daytime = timeOfDayOfDate(game.startTime);
	game.gross = game.profit + game.tips;
	var obj = playerTypeObject(game.risked, game.profit);
	game.roi = obj.roi;
	game.roiStr = obj.roiStr;
	game.img = obj.img;
	game.skillName = obj.name;
	game.skillNumber = obj.number;
}
function compressedGameFromGame(game) {
	var obj = {}
	obj.bankroll = game.bankroll;
	obj.breakMinutes = game.breakMinutes;
	obj.buyin = game.buyin;
	obj.cashout = game.cashout;
	obj.endTime = game.endTime;
	obj.food = game.food;
	obj.gameType = game.gameType;
	obj.id = game.id;
	obj.limit = game.limit;
	obj.location = game.location;
	obj.notes = game.notes;
	obj.rebuyAmount = game.rebuyAmount;
	obj.rebuys = game.rebuys;
	obj.stakes = game.stakes;
	obj.startTime = game.startTime;
	obj.status = game.status;
	obj.tips = game.tips;
	obj.tournamentFinish = game.tournamentFinish;
	obj.tournamentPaid = game.tournamentPaid;
	obj.tournamentSpots = game.tournamentSpots;
	obj.tournamentType = game.tournamentType;
	obj.type = game.type;
	return obj;
}
function netUserFromLine(line, num) {
	var elements = line.split("<xx>");
	var netObj = new Object();
	netObj.basicsStr = elements[0];
	netObj.last10Str = elements[1];
	netObj.yearStats = elements[2];
	netObj.monthStats = 'Jan 2018|0 (0W, 0L) 0%|0|0|0|0|0|0';
	var monthType = getMonthType(elements[3]);
	if (monthType == netTrackerMonth()) {
		netObj.monthStats = elements[3];
	}
	netObj.last10Obj = getNetUserStatObjFromLine(netObj.last10Str);
	netObj.yearStatsObj = getNetUserStatObjFromLine(netObj.yearStats);
	netObj.monthStatsObj = getNetUserStatObjFromLine(netObj.monthStats);
	netObj.lastGameStr = elements[4];
	netObj.last90Days = elements[5];
	netObj.thisMonthGames = elements[6];
	netObj.last10Games = elements[7];
	var components = netObj.basicsStr.split("|");
	if (components.length > 5) {
		netObj.name = components[0];
		netObj.userId = components[1];
		netObj.email = components[2];
		netObj.city = components[3];
		netObj.state = components[4];
		netObj.country = components[5];
		netObj.viewingUserId = components[6];
		netObj.friendStatus = components[7];
		netObj.nowPlayingFlg = components[8];
		netObj.moneySymbol = components[9];
		netObj.version = components[10];
		netObj.iconGroupNumber = components[11];
		netObj.theme = components[12];
		netObj.last10GamesObj = getLast10GamesObj(netObj.last10Games);
		netObj.location = 'Parts Unknown';
		if (netObj.city.length > 0) {
			if (netObj.country == 'USA')
				netObj.location = netObj.city + ', ' + netObj.state;
			else
				netObj.location = netObj.city + ', ' + netObj.country;
		}

		var statComponents = netObj.monthStats.split("|");
		var risked = parseInt(statComponents[3]);
		var profit = parseInt(statComponents[4]);
		var ptObj = playerTypeObject(risked, profit);
		netObj.img = ptObj.img;
		netObj.botLeft = statComponents[1];
		netObj.topRight = convertNumberToMoney(statComponents[4]);
		netObj.botRight = streakOfNum(statComponents[5]);
		if (netObj.nowPlayingFlg == 'Y')
			netObj.botLeft = '(Now Playing!)';
	}
	return netObj;
}
function getLast10GamesObj(last10Games) {
	var games = last10Games.split(':');
	var g = [];
	games.forEach(function (game) {
		var c = game.split('|');
		var dt = new Date(c[0]);
		g.push({ dt: dt, date: c[0], amount: c[1] });
	});
	g.sort((curr, next) => {
		return curr.dt > next.dt ? -1 : 1;
	});
	return g;
}
function getNetUserStatObjFromLine(line) {
	var c = line.split('|');
	return {
		name: c[0],
		gameStr: c[1],
		numGames: c[2],
		risked: c[3],
		profit: c[4],
		streak: c[5],
		obj: playerTypeObject(c[3], c[4]),
		streakStr: streakOfNum(c[5])
	}
}
function bigHandFromLine(line, items) {
	var obj = new Object();
	var c = line.split('|');
	if (c.length > 13) {
		obj.status = c[0];
		obj.winFlg = obj.status == 'Win';
		obj.handDate = c[1];
		obj.player1Hand = scrubHandVal(c[2]);
		obj.yourHand = scrubHandVal(c[2]);
		obj.player2Hand = scrubHandVal(c[3]);
		obj.player3Hand = scrubHandVal(c[4]);
		obj.player4Hand = scrubHandVal(c[5]);
		obj.player5Hand = scrubHandVal(c[6]);
		obj.player6Hand = scrubHandVal(c[7]);
		obj.flop = scrubHandVal(c[8]);
		obj.turn = c[9];
		obj.river = c[10];
		obj.potSize = c[11];
		obj.numPlayers = c[12];
		obj.name = c[13];
		obj.result = c[13];
		obj.comments = c[14];
		obj.button = c[15];
		if (obj.button == 'You')
			obj.button = 'Your Hand';
		obj.preFlopOdds = scrubOddsVal(c[16]);
		obj.postFlopOdds = scrubOddsVal(c[17]);
		obj.turnOdds = scrubOddsVal(c[18]);
		obj.riverOdds = scrubOddsVal(c[19]);
		obj.preFlopAction = c[20];
		obj.postFlopAction = c[21];
		obj.turnAction = c[22];
		obj.riverAction = c[23];
		obj.preFlopBet = c[24];
		obj.postFlopBet = c[25];
		obj.turnBet = c[26];
		obj.riverBet = c[27];
		obj.startingChips = c[28];

		if (obj.handDate.length > 10) {
			obj.handDate2 = obj.handDate;
			obj.handDate3 = convertStringToDate(obj.handDate);
			var dtObj = getDateObjFromJSDate(obj.handDate3);
			obj.handDate = dtObj.html5Date;
		}

		var allHands = [];
		allHands.push(handForPlayer(obj.player1Hand, 'Your Hand', obj.button));
		allHands.push(handForPlayer(obj.player2Hand, 'Player 2', obj.button));
		if (obj.player3Hand && obj.player3Hand.length > 1)
			allHands.push(handForPlayer(obj.player3Hand, 'Player 3', obj.button));
		if (obj.player4Hand && obj.player4Hand.length > 1)
			allHands.push(handForPlayer(obj.player4Hand, 'Player 4', obj.button));
		if (obj.player5Hand && obj.player5Hand.length > 1)
			allHands.push(handForPlayer(obj.player5Hand, 'Player 5', obj.button));
		if (obj.player6Hand && obj.player6Hand.length > 1)
			allHands.push(handForPlayer(obj.player6Hand, 'Player 6', obj.button));

		allHands.push(handForPlayer(obj.flop, 'Flop', obj.button));
		allHands.push(handForPlayer(obj.turn, 'Turn', obj.button));
		allHands.push(handForPlayer(obj.river, 'River', obj.button));

		obj.allHands = allHands;
	}
	return obj;
}
function handForPlayer(hand, name, button) {
	var cards = hand.split(' ');
	return {
		hand: hand,
		isButton: (hand == button),
		name: name,
		result: '',
		val: 0,
		cards: cards
	};
}
function scrubHandVal(line) {
	if (line) {
		line = line.replace(/-/g, ' ');
	}
	return line;
}
function scrubOddsVal(line) {
	if (line && line == '-outOfRange-') {
		return '';
	}
	return line;
}
function playerFromLine(line) {
	var obj = new Object();
	var c = line.split('|');
	if (c.length > 5) {
		obj.type = c[0];
		obj.name = c[1];
		obj.userId = parseInt(c[2]);
		obj.skill = parseInt(c[3]);
		obj.comments = c[4] + ' ' + c[5];
		obj.casino = c[6];
		obj.aggresiveNum = parseInt(c[9]);
		obj.looseNum = parseInt(c[10]);
	}
	return obj;
}
function filterFromLine(line, items) {
	var obj = new Object();
	var c = line.split('|');
	if (c.length > 5) {
		obj.dateRange = scrubFilterType(c[0]);

		obj.type = scrubFilterType(c[2]);
		obj.limit = scrubFilterType(c[3]);
		obj.stakes = scrubFilterType(c[4]);
		obj.casino = scrubFilterType(c[5]);
		obj.bankroll = scrubFilterType(c[6]);
		obj.tournamentType = scrubFilterType(c[7]);
		obj.button = c[8];
		obj.name = c[9];
		obj.displayFlg = true;
	}
	return obj;
}
function scrubFilterType(type) {
	if (type == 'LifeTime')
		return 'All';
	if (type.substring(0, 3) == 'All')
		return 'All';
	return type
}
function packageFilters(items, data) {
	var lines = [];
	items.forEach(function (obj) {
		var fields = [];
		fields.push(obj.dateRange);
		fields.push('');
		fields.push(obj.type);
		fields.push(obj.limit);
		fields.push(obj.stakes);
		fields.push(obj.casino);
		fields.push(obj.bankroll);
		fields.push(obj.tournamentType);
		fields.push(obj.button);
		fields.push(obj.name);
		var line = fields.join('|');
		lines.push(line);
	});
	return data + lines.join('\n');
}


function packagePlayers(items, data) {
	var lines = [];
	items.forEach(function (obj) {
		var fields = [];
		fields.push(obj.type);
		fields.push(obj.name);
		fields.push(obj.id);
		fields.push(obj.skill);
		fields.push(obj.comments);
		fields.push('');
		fields.push(obj.casino);
		fields.push('');
		fields.push('');
		fields.push(obj.aggresiveNum);
		fields.push(obj.looseNum);
		var line = fields.join('|');
		lines.push(line);
	});
	return data + lines.join('\n');
}
function packageBigHands(items, data) {
	var lines = [];
	items.forEach(function (obj) {
		var fields = [];
		var status = obj.winFlg ? 'Win' : 'Loss';
		fields.push(status);
		fields.push(obj.handDate);
		fields.push(handValToDB(obj.allHands[0].hand));
		fields.push(handValToDB(obj.allHands[1].hand));
		if (obj.allHands.length > 5)
			fields.push(handValToDB(obj.allHands[2].hand));
		else
			fields.push('');
		if (obj.allHands.length > 6)
			fields.push(handValToDB(obj.allHands[3].hand));
		else
			fields.push('');
		if (obj.allHands.length > 7)
			fields.push(handValToDB(obj.allHands[4].hand));
		else
			fields.push('');
		if (obj.allHands.length > 8)
			fields.push(handValToDB(obj.allHands[5].hand));
		else
			fields.push('');

		fields.push(handValToDB(obj.flop));
		fields.push(obj.turn);
		fields.push(obj.river);
		fields.push(obj.potSize);
		fields.push(obj.allHands.length - 3);
		fields.push(obj.name);
		fields.push(obj.comments);
		fields.push(obj.button);
		fields.push(obj.preFlopOdds);
		fields.push(obj.postFlopOdds);
		fields.push(obj.turnOdds);
		fields.push(obj.riverOdds);
		fields.push(obj.preFlopAction);
		fields.push(obj.postFlopAction);
		fields.push(obj.turnAction);
		fields.push(obj.riverAction);
		fields.push(obj.preFlopBet);
		fields.push(obj.postFlopBet);
		fields.push(obj.turnBet);
		fields.push(obj.riverBet);
		fields.push(obj.startingChips);
		var line = fields.join('|');
		lines.push(line);
	});
	return data + lines.join('\n');
}
function handValToDB(line) {
	if (line) {
		line = line.replace(/ /g, '-');
	}
	return line;
}
function packageGamess(items, data) {
	var lines = [];
	items.forEach(function (obj) {
		var fields = [];
		fields.push(obj.ptpStartTime);
		fields.push(obj.ptpEndTime);
		fields.push(obj.hours);
		fields.push(obj.buyin);
		fields.push(obj.rebuyAmount);
		fields.push(obj.food);
		fields.push(obj.cashout);
		fields.push(obj.profit);
		fields.push(obj.name);
		fields.push(obj.gameType);
		fields.push(obj.stakes);
		fields.push(obj.limit);
		fields.push(obj.location);
		fields.push(obj.bankroll);
		fields.push(obj.rebuys);
		fields.push(obj.notes);
		fields.push(obj.breakMinutes);
		fields.push(obj.tips);
		fields.push(obj.minutes);
		fields.push(obj.year);
		fields.push(obj.type);
		fields.push(obj.status);
		fields.push(obj.tournamentType);
		fields.push(obj.tournamentSpots);
		fields.push(obj.tournamentFinish);
		fields.push(obj.tournamentPaid);
		fields.push(obj.startTime);
		fields.push(obj.endTime);
		var line = fields.join('|');
		lines.push(line);
	});
	return data + lines.join('\n');
}
function lastGameStats(game, playFlg) {
	if (!game)
		return '';
	var now = new Date();
	var stats = [];
	stats.push(game.startTime);
	stats.push(game.buyin);
	stats.push(game.rebuyAmount);
	stats.push(game.cashout);
	stats.push(game.location);
	stats.push(game.minutes);
	stats.push(game.type);
	stats.push(playFlg);
	stats.push(game.gameType);
	stats.push(game.stakes);
	stats.push(game.limitType);
	stats.push(convertDateToString(now));
	stats.push(game.endTime);
	stats.push('$');
	stats.push('');
	stats.push(game.food);
	return stats.join('|');
}
/*function pIGameFromLine(line, type) {
	var components = line.split("\t");
	var game = new Object();
	game.startDate = convertStringToDate(components[0]);
	game.endDate = convertStringToDate(components[1]);
	game.buyin = components[8];
	game.tournamentType = components[10];
	game.cashout = components[9];
	game.gameType = components[5];
	game.limitType = components[6];
	game.location = components[7];
	game.notes = components[11];
	game.tips = components[15];
	game.tournyFlag = type == 'Tournament';
	return game;
}
function pjGameFromLine(line, type) {
	var components = line.split(",");
	var game = new Object();
	if (type == 'Tournament') {
		game.gameType = components[5];
		game.limitType = components[6];
		game.tournamentType = components[7];
		game.tournamentSpots = numberVal(components[13]);
		game.tournamentPaid = numberVal(components[14]);
		game.tournamentFinish = numberVal(components[15]);
		game.location = components[8];
		game.buyin = components[10];
		game.rebuys = components[11];
		game.rebuyAmount = components[12];
		game.tips = components[16];
		game.profit = components[19];
		game.cashout = parseFloat(game.buyin) + parseFloat(game.profit);
		game.notes = components[20];
	} else {
		game.gameType = components[6];
		game.limitType = components[7];
		game.location = components[9];
		game.buyin = components[11];
		game.rebuys = components[12];
		game.rebuyAmount = components[13];
		game.cashout = components[14];
		game.food = components[15];
		game.tips = components[16];
		game.notes = components[19];
		game.tournamentType = components[10];
		game.tips = components[15];
	}
	game.startDate = convertStringToDate(components[0]);
	game.endDate = convertStringToDate(components[1]);
	game.tournyFlag = (type == 'Tournament');
	return game;
}






function scrubBigHand(obj) {
	var components = obj.dateField.split(' ');
	obj.dateField = components[0];
	obj.img = (obj.status == 'Win') ? 'cards.png' : 'cardd.png';
	obj.topRight = obj.numPlayers + ' Players';
	obj.botLeft = obj.dateField;
	obj.botRight = obj.potSize;
	return obj;
}
function parseVersion() {
	var pVersion = '1.7';
	console.log('xxxpVersionxxx', pVersion);
	return pVersion;
}
function gameFromHtmlFields(oldGame, status, tournyFlag) {
	disableButton('saveButton', true);
	var game = new Object();
	game.type = oldGame.type;
	game.startTime = innerHTMLFromElement('startField');
	game.endTime = innerHTMLFromElement('endField');

	game.startDate = convertStringToDate(game.startTime);
	if (game.endTime.length > 0)
		game.endDate = convertStringToDate(game.endTime);
	game.buyin = moneyToNumber(innerHTMLFromElement('buyinField'));
	game.cashout = moneyToNumber(innerHTMLFromElement('cashoutField'));
	game.rebuyAmount = moneyToNumber(innerHTMLFromElement('rebuyField'));
	game.rebuys = moneyToNumber(innerHTMLFromElement('rebuysField'));
	game.tips = moneyToNumber(innerHTMLFromElement('tipsField'));
	game.food = moneyToNumber(innerHTMLFromElement('foodField'));
	game.breakMinutes = moneyToNumber(innerHTMLFromElement('breakMinutesField'));
	game.location = innerHTMLFromElement('locationField');
	game.bankroll = innerHTMLFromElement('bankrollField');
	game.ID = oldGame.ID;
	game.hudHeroLine = oldGame.hudHeroLine;
	game.hudVillianLine = oldGame.hudVillianLine;
	game.hudPlayerId = oldGame.hudPlayerId;

	if (game.ID > 0) { //edit
		game.notes = innerHTMLFromElement('notesField');
		game.status = 'Completed';
		var type = document.getElementById('typeField').innerHTML;
		if (type && type.length > 0)
			game.type = type;
		game.tournyFlag = (type == "Tournament");
		game.gameType = document.getElementById('gameTypeField').innerHTML;
		game.limitType = document.getElementById('limitTypeField').innerHTML;
		if (game.tournyFlag) {
			game.tournamentType = innerHTMLFromElement('tournamentTypeField'); //document.getElementById('tournamentTypeField').innerHTML;
			game.tournamentFinish = innerHTMLFromElement('tournamentFinishField'); //document.getElementById('tournamentFinishField').innerHTML;
			game.tournamentSpots = innerHTMLFromElement('tournamentSpotsField'); //document.getElementById('tournamentSpotsField').innerHTML;
			game.tournamentPaid = innerHTMLFromElement('tournamentPaidField'); //document.getElementById('tournamentPaidField').innerHTML;
		} else
			game.stakes = document.getElementById('stakesField').innerHTML;
	} else { //newgame
		game.tournyFlag = tournyFlag;
		game.status = status;
	}
	var e = document.getElementById('gameType0');
	if (e) {
		game.tournyFlag = (e.className == 'btn green-segment');
		var gameType = '';
		var limitType = '';
		var tournamentType = '';
		var stakes = '';
		var type = 'Cash';
		if (document.getElementById('gameType1').className == 'btn yellow-segment')
			type = 'Tournament';
		game.type = type;
		if (document.getElementById('gameName0').className == 'btn yellow-segment')
			gameType = innerHTMLFromElement('gameField1');
		if (document.getElementById('gameName1').className == 'btn yellow-segment')
			gameType = innerHTMLFromElement('gameField2');
		if (document.getElementById('gameName2').className == 'btn yellow-segment')
			gameType = innerHTMLFromElement('gameField3');

		if (document.getElementById('gameLimit0').className == 'btn yellow-segment')
			limitType = innerHTMLFromElement('limitField1');
		if (document.getElementById('gameLimit1').className == 'btn yellow-segment')
			limitType = innerHTMLFromElement('limitField2');
		if (document.getElementById('gameLimit2').className == 'btn yellow-segment')
			limitType = innerHTMLFromElement('limitField3');

		if (document.getElementById('gameTourney0').className == 'btn yellow-segment')
			tournamentType = innerHTMLFromElement('ttField1');
		if (document.getElementById('gameTourney1').className == 'btn yellow-segment')
			tournamentType = innerHTMLFromElement('ttField2');

		if (document.getElementById('gameStakes0').className == 'btn yellow-segment')
			stakes = innerHTMLFromElement('stakesField1');
		if (document.getElementById('gameStakes1').className == 'btn yellow-segment')
			stakes = innerHTMLFromElement('stakesField2');
		if (document.getElementById('gameStakes2').className == 'btn yellow-segment')
			stakes = innerHTMLFromElement('stakesField3');
		if (document.getElementById('gameStakes3').className == 'btn yellow-segment')
			stakes = innerHTMLFromElement('stakesField4');

		game.gameType = gameType;
		game.limitType = limitType;
		game.tournamentType = tournamentType;
		game.stakes = stakes;
	}
	return game;
}
function isDateValid(d) {
	return (d && !isNaN(d.getTime()));
}
function figureOutStartDate(startDate, startTime) {
	if (isDateValid(startDate))
		return startDate;
	if (startTime && startTime.length > 5) {
		startDate = convertStringToDate(startTime);
		if (isDateValid(startDate))
			return startDate;
	}
	return new Date();
}
function scrubGame(game) {
	if (!game)
		return;
	if (!isDateValid(game.endDate)) {
		game.endDate = new Date();
		game.cashout = game.buyin;
	}
	game.startDate = figureOutStartDate(game.startDate, game.startTime);
	game.startTime = convertDateToString(game.startDate);
	game.status = game.status || 'Completed';
	game.endTime = convertDateToString(game.endDate);
	var lastUpd = new Date();
	var lastUpdTime = convertDateToString(lastUpd);
	var year = game.startDate.getFullYear();
	game.year = year.toString();
	game.month = monthName(game.startDate);
	game.daytime = daytimeName(game.startDate);
	game.minutes = parseInt((game.endDate - game.startDate) / 60000);
	if (game.minutes < 0) {
		console.log('whoa!!!! game minutes suck!', game.startDate);
		game.minutes += 60 * 12;
	}
	game.breakMinutes = numberVal(game.breakMinutes);
	game.notes = game.notes || ' ';
	game.rebuys = numberVal(game.rebuys);
	game.tournamentFinish = numberVal(game.tournamentFinish);
	game.tournamentSpots = numberVal(game.tournamentSpots);
	game.tournamentPaid = numberVal(game.tournamentPaid);
	game.gameMinutes = numberVal(game.minutes) - numberVal(game.breakMinutes);
	game.hours = (game.minutes / 60).toFixed(1) + ' Hrs';
	game.gameType = scrubRefData(game.gameType);
	game.stakes = scrubRefData(game.stakes);
	game.tournamentType = scrubRefData(game.tournamentType);
	game.profit = floatVal(game.cashout) + floatVal(game.food) - floatVal(game.buyin) - floatVal(game.rebuyAmount);
	game.weekday = getWeekday(game.startDate);
	if (!game.type || game.type.length == 0)
		game.type = 'Cash';
	game.tournyFlag = (game.type && game.type == 'Tournament');
	game.day = game.startDate.getDate();
	if (!game.month || game.month.length < 3 || isNaN(game.day)) {
		console.log('-----------------xxscrubGamexx xxxbad data2xxx', game);
	}
	game.startDay = game.month.substring(0, 3) + ' ' + game.day + ', ' + game.year;
	game.dateStamp = convertDateToDateStamp(game.startDate);
	game.tips = numberVal(game.tips);
	game.food = numberVal(game.food);
	game.roi = 0;
	game.risked = numberVal(game.buyin) + numberVal(game.rebuyAmount);
	game.profitFactor = profitFactorForGame(game);
	game.profitMargin = profitMarginForGame(game);
	game.profitMarginText = profitMarginTextForGame(game);
	if (game.risked > 0)
		game.roi = parseInt(game.profit * 100 / game.risked);
	if (game.tournyFlag) {
		game.stakes = '';
		game.food = 0;
		game.tips = 0;
		if (game.tournamentType == '')
			game.tournamentType = 'Multi Table';
		game.name = game.gameType + ' ' + game.limitType || '';
	} else {
		game.tournamentType = '';
		if (game.stakes == '')
			game.stakes = '$1/$3';
		game.name = game.gameType + ' ' + game.stakes || '' + ' ' + game.limitType || '';
	}
	game.bankroll = game.bankroll || 'Default';
	if (game.bankroll.length == 0)
		game.bankroll = 'Default';

	return game;
}
function profitMarginTextForGame(game) {
	return 'hey!';
}
function profitFactorForGame(game) {
	if (game.type == 'Cash') {
		var bb = findBB(game.stakes);
		var startFactor = bb * 100;
		if (startFactor == 0)
			startFactor = numberVal(game.buyin);
		if (startFactor == 0)
			startFactor = 1;
		return startFactor + numberVal(game.rebuyAmount);
	} else {
		return (game.risked == 0) ? 1 : game.risked;
	}
}
function findBB(stakes) {
	var elements = stakes.split("\/");
	return moneyToNumber(elements[1]);
}
function profitMarginForGame(game) {
	var profitFactor = profitFactorForGame(game);
	return parseInt(game.profit * 100 / profitFactor);
}

function parsePlayerIntoObj(row, picNum) {
	var obj = new Object();
	var skill = ['Weak', 'Average', 'Strong', 'Pro'];
	var images = ['playerType0.png', 'playerType3.png', 'playerType4.png', 'playerType5.png']
	return {
		ID: row.ID, img: images[row.skillNum],
		name: row.name,
		aggresiveNum: row.aggresiveNum,
		strengths: row.strengths,
		weaknesses: row.weaknesses,
		looseNum: row.looseNum,
		status: row.status,
		hudHeroLine: row.hudHeroLine,
		hudVillianLine: row.hudVillianLine,
		skillNum: row.skillNum,
		skillLabel: row.skillLabel,
		location: row.location,
		userId: row.userId,
		picNum: picNum,
		topRight: row.location,
		botLeft: row.skillLabel,
		botRight: skill[row.skillNum]
	};
}

//-----------------------------liveUpdateStats

*/