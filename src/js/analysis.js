function analysisTextForPlayer(obj, appName, displayYear, gameType, allStatsObj, thisYearObj, thisMonthObj, lastMonthObj, lastYearObj, mikeCaroVer) {
	var analysisParagraphs = []
	var totalProfit = obj.profitStr;
	obj.totalProfit = totalProfit;
	var lastGameSkillNum = 0;
	var year = numberVal(displayYear);
	var currentYear = nowYear();
	var lastProfit='';
	if(obj.lastGame) {
		var obj2 = playerTypeObject(obj.lastGame.buyin+obj.lastGame.rebuyAmount, obj.lastGame.profit);
		lastGameSkillNum = parseInt(obj2.number);
		lastProfit = (obj.lastGame.profit>=0)?convertNumberToMoney(obj.lastGame.profit):convertNumberToMoney(obj.lastGame.profit*-1);
	}
	console.log('gameType', gameType);
	if(displayYear == 'Last 10') {
		if(obj.numGames==0) {
			analysisParagraphs.push("Welcome to "+appName+" Game Analyzer. Look to this page for analysis of your game and helpful advice!");
			return analysisParagraphs;
		} else if(obj.numGames==1) {
			var list1 = ["terrible", "lousy", "rough", "decent", "great", "fantastic"];
			var list2 = ["catastrophic", "slow", "slow", "good", "good", "great"];
			var winning = (obj.lastGame.profit>=0)?'winning '+convertNumberToMoney(obj.lastGame.profit):'losing '+convertNumberToMoney(obj.lastGame.profit*-1);
			analysisParagraphs.push("You are off to a "+list1[lastGameSkillNum]+" start after a "+list2[lastGameSkillNum]+" game at "+obj.lastGame.location+", "+winning+" on the "+obj.lastGame.daytime+".");
			var finalComment = (obj.streak>0)?"Let's hope the solid play and good cards continue.":"Let's hope your luck turns around with the next game.";
			analysisParagraphs.push(finalComment);
		} else if(obj.numGames==2) {
			if(obj.streak<=-2) {
				analysisParagraphs.push("Ouch!");
				if(lastGameSkillNum==0)
					analysisParagraphs.push("Another crash and burn session this "+obj.lastGame.weekday+" at "+obj.lastGame.location+" losing "+lastProfit+" and racking up your second loss.");
				else 
					analysisParagraphs.push("Another disappointing "+obj.lastGame.daytime+" at "+obj.lastGame.location+" losing "+lastProfit+" and racking up your second loss, but at least you were able to walk away from the table with some chips.");
				analysisParagraphs.push("It's ok though, not time to panic. Everyone goes card dead from time to time and we all take our bad beats.");
			}
			if(obj.streak==-1) {
				analysisParagraphs.push("Well you win some, you lose some and this just wasn't your "+obj.lastGame.daytime+".");
				if(obj.profit>=0)
					analysisParagraphs.push("Tough outing at "+obj.lastGame.location+", losing "+lastProfit+" in a game that just wasn't meant to be, but the good news is that you are up "+totalProfit+" after 2 games.");
				else 
					analysisParagraphs.push("Rough outing at "+obj.lastGame.location+", losing "+lastProfit+" in a game that just wasn't meant to be, dropping your overall profit to "+totalProfit+".");
				analysisParagraphs.push("Ok its one good game, one bad game and moving on from here.");
			}
			if(obj.streak==1) {
				analysisParagraphs.push("That's how you play poker!");
				if(obj.profit>=0)
					analysisParagraphs.push("Great night "+obj.lastGame.location+", recovering from the previous loss by winning "+lastProfit+" and getting your overall money in the black.");
				else 
					analysisParagraphs.push("Good win at "+obj.lastGame.location+", for "+lastProfit+" which helped recover some of the losses from your first game.");
				analysisParagraphs.push("Now that you are on a winning streak, its time to push forward and really get your bankroll moving.");
			}
			if(obj.streak>=2) {
				analysisParagraphs.push("Outstanding! You are making poker look easy.");
				if(lastGameSkillNum>=4)
					analysisParagraphs.push("Not just another win, but a big win at "+obj.lastGame.location+", winning "+lastProfit+" and bumping your overall bankroll to "+totalProfit+" after 2 games.");
				else 
					analysisParagraphs.push("That's 2 wins in 2 games after taking "+lastProfit+" at "+obj.lastGame.location+" this "+obj.lastGame.weekday+".");
				analysisParagraphs.push("Great start. Keep it going!");
			}
		} else { // game>2
			var lines = getOpeningAndClosingLines(lastGameSkillNum, obj.streak, obj);
			var lastGameDetails = getGameDetails(obj, lastGameSkillNum, totalProfit, lastProfit);
		
			analysisParagraphs.push(lines[0]);
			analysisParagraphs.push(lastGameDetails);
			if(obj.lastGame && obj.lastGame.roi) {
				var records = recordsAnaysis(obj.lastGame, allStatsObj, thisYearObj, thisMonthObj);
				if(records && records.length>0)
					analysisParagraphs.push(records);
			}
			
			if(thisMonthObj.numGames>2 && lastMonthObj.numGames>2)
				analysisParagraphs.push(monthOverMonthStats(thisMonthObj, lastMonthObj));
				
			if(thisYearObj.numGames>2 && lastYearObj.numGames>2)
				analysisParagraphs.push(yearOverYearAnaysis(thisYearObj, lastYearObj));
			analysisParagraphs.push(lines[1]);
		}
		if(mikeCaroVer)
			analysisParagraphs.push(getCaroQuoteForNumber(allStatsObj.numGames));
		else
			analysisParagraphs.push(getQuoteForNumber(allStatsObj.numGames));
	} else if(displayYear == 'All'){ //complete year
		analysisParagraphs.push(getAnalysisForAllGames(obj, gameType));
	} else if(year == currentYear) {
		return getAnalysisForCurrentYear(obj, gameType, year);
	} else if(year<currentYear) {
		analysisParagraphs.push(getAnalysisForPreviousYear(obj, gameType, year));
	}
	return analysisParagraphs;
}
function recordsAnaysis(lastGameObj, allStatsObj, thisYearObj, thisMonthObj) {
	var profit = numberVal(lastGameObj.profit);
	if(allStatsObj.numGames>20) {
		var message = checkRecordsForProfit(profit, allStatsObj, 'ever');
		if(message && message.length>0)
			return message;
		message = checkRecordsForStreak(allStatsObj, 'ever');
		if(message && message.length>0)
			return message;
	}
	if(thisYearObj.numGames>15) {
		var message = checkRecordsForProfit(profit, thisYearObj, 'this year');
		if(message && message.length>0)
			return message;
		message = checkRecordsForStreak(thisYearObj, 'this year');
		if(message && message.length>0)
			return message;
	}
	if(thisMonthObj.numGames>10) {
		var message = checkRecordsForProfit(profit, thisMonthObj, 'this month');
		if(message && message.length>0)
			return message;
		message = checkRecordsForStreak(thisMonthObj, 'this month');
		if(message && message.length>0)
			return message;
	}
	return '';
}
function checkRecordsForStreak(obj, timeframe) {
	if(obj.streak>2 && obj.streak>=obj.longestWinStreak)
		return 'Congratulations! You are currently on your best winning streak '+timeframe+'!';
}
function checkRecordsForProfit(profit, obj, timeframe) {
	if(profit>=numberVal(obj.biggestWin))
		return 'Congratulations! You just had your biggest win '+timeframe+'!';
	if(profit>=numberVal(obj.biggestWin2))
		return 'Congratulations! You just had your second biggest win '+timeframe+'!';
	if(profit>=numberVal(obj.biggestWin3))
		return 'Congratulations! You just had your third biggest win '+timeframe+'!';
	if(profit<numberVal(obj.biggestLoss))
		return 'Yikes! You just had your biggest loss '+timeframe+'!';
	if(profit<numberVal(obj.biggestLoss2))
		return 'Yikes! You just had your second biggest loss '+timeframe+'!';
	if(profit<numberVal(obj.biggestLoss3))
		return 'Yikes! You just had your third biggest loss '+timeframe+'!';
}

function yearOverYearAnaysis(thisYearObj, lastYearObj) {
	var day = getdayOfYear();
	var year= nowYear();
	var lastYear = year-1;
	console.log(thisYearObj);
	console.log(lastYearObj);
	var projectedProfit = 0;
	if(day>0)
		projectedProfit = thisYearObj.profit*365/day;
		
	if(projectedProfit>=0) {
		if(projectedProfit>=lastYearObj.profit)
			return 'You are on pace to win '+convertNumberToMoney(projectedProfit)+' this year after '+thisYearObj.numGames+' games, which is better than '+lastYear+' when you '+winLossString(lastYearObj.profit)+'.';
		else
			return 'You are on pace to win '+convertNumberToMoney(projectedProfit)+' this year after '+thisYearObj.numGames+' games, which is not as good as your '+lastYear+' stats when you '+winLossString(lastYearObj.profit)+'.';
	} else {
		if(projectedProfit>=lastYearObj.profit)
			return 'You are on pace for losses of '+convertNumberToMoney(projectedProfit)+' this year after '+thisYearObj.numGames+' games, which is better than '+lastYear+' when you '+winLossString(lastYearObj.profit)+'.';
		else
			return 'You are on pace for losses of '+convertNumberToMoney(projectedProfit)+' this year after '+thisYearObj.numGames+' games, which is not as good as your '+lastYear+' stats when you '+winLossString(lastYearObj.profit)+'.';
	}
}
function winLossString(profit) {
	var winloss = (profit>=0)?'won':'lost';
	return winloss+' '+convertNumberToMoney(profit);
}
function monthOverMonthStats(thisMonthObj, lastMonthObj) {
	var thisMonth = thisMonthObj.lastGame.month;
	var lastMonth = lastMonthObj.lastGame.month;
	var lastMonthProfit = convertNumberToMoney(lastMonthObj.profit);
	var thisMonthProfit = convertNumberToMoney(thisMonthObj.profit);
	var numStr = numberWithSuffix(thisMonthObj.numGames);
	// "+thisMonthObj.numGames+" "+thisMonth+" "+lastMonth+" "+lastMonthProfit+" "+thisMonthProfit+" "+numStr+" 
    switch (lastMonthObj.overallSkillNum) {
        case 0:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "Well at least you are consistent. We all thought last month was a disaster but after "+thisMonthObj.numGames+" games, your "+thisMonth+" play is proof that you are flat out just a bad player.";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is a total disaster. The single redeeming fact is that this month is just slightly less crappy than last month.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is a total disaster. The single redeeming fact is that this month is just slightly less crappy than last month.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", which is a huge improvement from the disaster you faced last month.";
                    break;
                case 4:
                    return "Wow! What a difference a month makes. You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be a great poker month for you. Much improved from the bloodbath last month. You have been able to add "+thisMonthProfit+" to your bankroll in "+thisMonth+".";
                    break;
                case 5:
                    return "Amazing! From worst to first in one month! "+thisMonth+" has been a fantastic month for you, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game. A huge swing from the disaster last month.";
                    break;
            }
            break;
        case 1:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "Just when we thought it couldn't get any worse. We all thought last month was a disaster but after "+thisMonthObj.numGames+" games, you have actually managed to play even more poorly in "+thisMonth+"!";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is another losing month for you so far. You are on pace to finish this month about the same as last.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is another losing month for you so far. You are on pace to finish this month about the same as last.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", which is a an improvement from the losing you faced last month.";
                    break;
                case 4:
                    return "Wow! What a difference a month makes. You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be a great poker month for you. Much improved from the disappointment last month. You have been able to add "+thisMonthProfit+" to your bankroll in "+thisMonth+".";
                    break;
                case 5:
                    return "Amazing! You have really turned your game around this month! "+thisMonth+" has been a fantastic month for you so far, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game. A nice turnaround from the losses last month.";
                    break;
            }
            break;
        case 2:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "Just when we thought it couldn't get any worse. We all thought last month was a disaster but after "+thisMonthObj.numGames+" games, you have actually managed to play even more poorly in "+thisMonth+"!";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is another losing month for you so far. You are on pace to finish this month about the same as last.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is another losing month for you so far. You are on pace to finish this month about the same as last.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", which is a an improvement from the losing you faced last month.";
                    break;
                case 4:
                    return "Wow! What a difference a month makes. You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be a great poker month for you. Much improved from the disappointment last month. You have been able to add "+thisMonthProfit+" to your bankroll in "+thisMonth+".";
                    break;
                case 5:
                    return "Amazing! You have really turned your game around this month! "+thisMonth+" has been a fantastic month for you so far, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game. A nice turnaround from the losses last month.";
                    break;
            }
            break;
        case 3:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "So far after "+thisMonthObj.numGames+" games, "+thisMonth+" is a disaster. Especially compared to last month when you were able to bring in "+lastMonthProfit+" in profit.";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a losing month. Not quite as nice as last month when you brought in "+lastMonthProfit+" in profit.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a losing month. Not quite as nice as last month when you brought in "+lastMonthProfit+" in profit.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", about on pace with your play last month.";
                    break;
                case 4:
                    return "You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be another solid month and even better than you did last month. You have been able to add "+thisMonthProfit+" to your bankroll this month.";
                    break;
                case 5:
                    return ""+thisMonth+" has been a really fantastic month for you, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game. A big improvement from last month.";
                    break;
            }
            break;
        case 4:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "So far after "+thisMonthObj.numGames+" games, "+thisMonth+" is a disaster. Especially compared to last month when you raked in "+lastMonthProfit+" in profit.";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a pretty crappy month compared to last month when you added "+lastMonthProfit+" in profit.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a pretty crappy month compared to last month when you added "+lastMonthProfit+" in profit.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", although it's not quite as strong as you did last month.";
                    break;
                case 4:
                    return "You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be another solid month and on pace with what you did last month. You have been able to add "+thisMonthProfit+" to your bankroll this month.";
                    break;
                case 5:
                    return ""+thisMonth+" has been another fantastic month for you, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game. You are on pace to have an even better month than you did last month.";
                    break;
            }
            break;
        case 5:
            switch (thisMonthObj.overallSkillNum) {
                case 0:
                    return "So far after "+thisMonthObj.numGames+" games, "+thisMonth+" is a disaster. Especially compared to last month when you raked in "+lastMonthProfit+" in profit.";
                    break;
                case 1:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a pretty crappy month compared to last month when you raked in "+lastMonthProfit+" in profit.";
                    break;
                case 2:
                    return "After "+thisMonthObj.numGames+" games completed, "+thisMonth+" is shaping up to be a pretty crappy month compared to last month when you raked in "+lastMonthProfit+" in profit.";
                    break;
                case 3:
                    return "With "+thisMonthObj.numGames+" games on the books, you are managing to keep a positive bankroll in "+thisMonth+", although it's not nearly as strong as you did last month.";
                    break;
                case 4:
                    return "You just completed your "+numStr+" game and "+thisMonth+" is shaping up to be another solid month although not quite as good as you did last month. You have been able to add "+thisMonthProfit+" to your bankroll this month.";
                    break;
                case 5:
                    return ""+thisMonth+" has been another fantastic month for you, with "+thisMonthProfit+" in winnings after just completing your "+numStr+" game.";
                    break;
            }
            break;
    }
}
function getAnalysisForCurrentYear(obj, gameType, year) {
	var adjectives = ["ghastly", "terrible", "slow", "fair", "great", "really great"];
	var adjective = adjectives[obj.overallSkillNum];
	if(obj.numGames==0)
		return ["A new year starting! Lets hope its a good one..."];

	if(obj.numGames==1 && obj.wins==1)
		return ["You've only played "+gameCount(obj.numGames, gameType)+", but it was for a win so it looks like it's going to be a pretty good year."];
	if(obj.numGames==1 && obj.wins==0)
		return ["You've only played "+gameCount(obj.numGames, gameType)+" so its far too early to tell what kind of year it's going to be."];
	if(obj.numGames <5) {
		return ["So far you have only played "+gameCount(obj.numGames, gameType)+" this year so its too early to make any hard evaluations but with "+winString(obj.wins)+" and "+lossString(obj.losses)+" you are off to a "+adjective+" start."];
	}
	var upDown = (obj.profit<0)?'down':'up';
	var winLose = (obj.profit<0)?'lose':'win';
	var dayOfYear = getdayOfYear();
	var projectedTotal = obj.profit*365/dayOfYear;
	var line1 = "Your "+year.toString()+" play has been "+adjective+" this year with "+winString(obj.wins)+" out of "+gameCount(obj.numGames, gameType)+" played.";
	var line2 = "You are currently "+upDown+" "+obj.totalProfit+" in "+year+" and on pace to "+winLose+" "+convertNumberToMoney(projectedTotal)+".";
	
	var yearTrimester = parseInt(dayOfYear/122);
	var closing='';
	switch (obj.overallSkillNum) {
		case 0:
			switch (yearTrimester) {
				case 0:
					closing = "You are not off to a good start this year and might need to mortgage your home before its over.";
					break;
				case 1:
					closing = "So far this year has been a disaster. My grandma plays a better poker game.";
					break;
				default:
					closing = "Its pretty much time to write this year off and start thinking about what you are going to do different next year.";
					break;
			}
			break;
		case 1:
			switch (yearTrimester) {
				case 0:
					closing = "You are off to a slow start but there's still plenty of time to turn things around.";
					break;
				case 1:
					closing = "Its time to turn this game around and start making some money.";
					break;
				default:
					closing = "Hopefully a strong finish this year will put you back in the black.";
					break;
			}
			break;
		case 2:
			switch (yearTrimester) {
				case 0:
					closing = "You are off to a slow start but there's still plenty of time to turn things around.";
					break;
				case 1:
					closing = "Its time to turn this game around and start making some money.";
					break;
				default:
					closing = "Hopefully a strong finish this year will put you back in the black.";
					break;
			}
			break;
		case 3:
			switch (yearTrimester) {
				case 0:
					closing = "You are off to a good start this year and have a profitable game. Keep it going.";
					break;
				case 1:
					closing = "You've been able to make some money this year, but you are in need of a couple more big wins.";
					break;
				default:
					closing = "You've been making money solidly all year long, although its not time to quit your day job.";
					break;
			}
			break;
		case 4:
			switch (yearTrimester) {
				case 0:
					closing = "Great start to the year so far and hopefully things continue at this pace.";
					break;
				case 1:
					closing = "Its been a great year overall and well worth the time invested.";
					break;
				default:
					closing = "You have to be very happy with your performance this year.";
					break;
			}
			break;
		case 5:
			switch (yearTrimester) {
				case 0:
					closing = "You are off to an amazing start and hopefully its not just a couple of fluke games.";
					break;
				case 1:
					closing = "This year has been one of the truly great stories in poker history.";
					break;
				default:
					closing = "Another amazing year for the poker genius.";
					break;
			}
			break;
	}
	return [line1, line2, closing];
}
function getdayOfYear() {
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
	var val = Math.floor(diff / (1000 * 60 * 60 * 24));
	if(val<1)
		val=1;
	return val;
}
function gameCount(num, gameType) {
	var gameTypes1 = ['game', 'cash game', 'tournament'];
	var gameTypes2 = ['games', 'cash games', 'tournaments'];
	if(num==1)
		return "1 "+gameTypes1[gameType];
	else
		return num.toString()+" "+gameTypes2[gameType];
}
function getAnalysisForPreviousYear(obj, gameType, year) {
	if(obj.numGames==0)
		return "You didn't play any games in "+year.toString()+".";

	if(obj.numGames==1 && obj.wins==1)
		return "You've only played "+gameCount(obj.numGames, gameType)+", but it was for a win so i guess it was a good year.";
	if(obj.numGames==1 && obj.wins==0)
		return "You've only played "+gameCount(obj.numGames, gameType)+" so there's not enough info to make an informative evaluation.";

	// "+obj.totalProfit+" "+lastProfit+" "+obj.lastGame.location+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" "+adjectGame+" "+winLoss+"
	var lines = ["The bloodbath mercifully ended after "+obj.losses+" losses and a total profit of "+obj.totalProfit+".",
	"It was not a good year for you seeing your final profit come in at "+obj.totalProfit+" with "+obj.losses+" total losses.",
	"Things could have been worse for you as your final profit finished at "+obj.totalProfit+".",
	"Not a bad year for you as you were able to add "+obj.totalProfit+" to your bankroll.",
	"All around, a fantastic year for you, seeing your bankroll increase by "+obj.totalProfit+".",
	"Give yourself a pat on the back. Phenomenal year wrapped up with "+obj.totalProfit+" added to your bankroll. Nice work!"]
	var finalLine = lines[obj.overallSkillNum];
	var adjectives = ["ghastly", "terrible", "slow", "fair", "great", "really great"];
	var adjective = adjectives[obj.overallSkillNum];
	return "Your "+year.toString()+" play was "+adjective+" with "+winString(obj.wins)+" out of "+gameCount(obj.numGames, gameType)+" played. "+finalLine;
}
function getAnalysisForAllGames(obj, gameType) {
	var adjectives = ["ghastly", "terrible", "slow", "fair", "great", "really great"];
	var adjective = adjectives[obj.overallSkillNum];
	var gameTypes = ['games', 'cash games', 'tournaments'];
	var game = gameTypes[gameType];
	if(obj.numGames==0)
		return "No games played yet.";
	if(obj.numGames==1 && obj.profit>=0)
		return "You've only played 1 game, but it was for a win so it looks like you are a pretty good poker player to me.";
	if(obj.numGames==1 && obj.profit<0)
		return "You've only played 1 game so its far too early to tell what kind of game you have.";
	if(obj.numGames <5) 
		return "So far you have only played "+obj.numGames+" "+game+" so its too early to make any hard evaluations but with "+winString(obj.wins)+" and "+lossString(obj.losses)+" you are off to a "+adjective+" start.";
	// "+obj.totalProfit+" "+lastProfit+" "+obj.lastGame.location+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" "+adjectGame+" "+winLoss+"

	var skill0 = ["Your poker skills are in need of some serious fine tuning as you have only been able to get "+winString(obj.wins)+" in "+obj.numGames+" games and have lost a total of "+obj.totalProfit+". You need to change up your game and study what the pros do. Poker is not about trying to outbluff the bluffer and stealing tiny pots with 2-4 offsuit.",
	"Your cash game skills are pretty bad right now as you were able to get only "+winString(obj.wins)+" in "+obj.numGames+" games and have lost a total of "+obj.totalProfit+". Try getting more rest and don't be afraid to leave the table when you still have chips.",
	"Tournament poker might not be the right game for you and maybe you should stick to the cash games for now"]
	var skill1 = ["You have some signs of promise and moments of greatness, but after losing "+obj.losses+" out of "+obj.numGames+" games for a loss of "+obj.totalProfit+", you need some tweaking. Try reading up on poker strategy and start playing better cards. Bluff less in late rounds but play more aggressive preflop. The key is making targeted moves.",
	"You are currently losing money in cash games with "+obj.losses+" losses in "+obj.numGames+" games for a combined total of "+obj.totalProfit+" down the drain. You need to start playing smarter poker and make better laydowns. Don't be afraid to lay down top pair to a large bet.",
	"You aren't the type of tournament player that's going to make a lot of money, but as long as you are playing for the entertainment, its a great sport."]
	var skill2 = ["You have some signs of promise and moments of greatness, but after losing "+obj.losses+" out of "+obj.numGames+" games for a loss of "+obj.totalProfit+", you need some tweaking. Try reading up on poker strategy and start playing better cards. Bluff less in late rounds but play more aggressive preflop. The key is making targeted moves.",
	"You are currently losing money in cash games with "+obj.losses+" losses in "+obj.numGames+" games for a combined total of "+obj.totalProfit+" down the drain. You need to start playing smarter poker and make better laydowns. Don't be afraid to lay down top pair to a large bet.",
	"You aren't the type of tournament player that's going to make a lot of money, but as long as you are playing for the entertainment, its a great sport."]
	var skill3 = ["You have a solid poker game winning "+obj.wins+" out of "+obj.numGames+" games for a career total of "+obj.totalProfit+" in winnings. There's plenty of room for improvement though as you are still losing too many games. Try making larger bets against weak opponents and smaller bets against the stronger ones. You want to get the maximum pot out of each winning hand.",
	"Grinding out win after win at the cash tables has gained you a total of "+obj.totalProfit+" by winning "+obj.numGames+" games. That's not bad but you are still leaving too much money on the table. Don't be afraid to play a little more aggressive at times in order to maximize every pot.",
	"You are a very decent tournament player and have cashed often. Keep up the good work."];
	var skill4 = ["You are truly a poker shark after winning "+obj.wins+" out of "+obj.numGames+" games for a career total of "+obj.totalProfit+" in winnings. Keep plugging away and keep working on your game. You aren't far from the 'Pro' classification.",
	"Danger! Shark alert! After winning "+obj.wins+" out of "+obj.numGames+" cash games for a career total of "+obj.totalProfit+" winnings you are a feared poker player. Keep plugging away and keep working on hte fundamentals to take your game to the next level.",
	"Tournaments have become an atm for you so keep at it and continue to work on your game."];
	var skill5 = ["You have been given the rank of Pro and there's a reason for it. You have a phenomenal win percentage after "+obj.numGames+" games and have banked a massive "+obj.totalProfit+" in winnings. Keep playing the same solid poker that got you here in the first place and don't let your ego get the best of you. Remember winning streaks never last forever and the next bad beat is just around the corner. But keep up the great work!",
	"Making money at the cash tables has come easy to you, cashing "+obj.wins+" times in "+obj.numGames+" games for a hefty "+obj.totalProfit+" in winnings. Keep playing the same solid poker that got you here in the first place and don't let your ego get the best of you. You never want to let your guard down.",
	"At "+obj.totalProfit+" profit, your tournament play is off the charts. If I was you I'd aim for bigger stakes."];
	var data = [skill0, skill1, skill2, skill3, skill4, skill5];
	return data[obj.overallSkillNum][gameType];
}
function winString(num) {
	var wins = (num==1)?'win':'wins';
	return num.toString()+' '+wins;
}
function lossString(num) {
	var wins = (num==1)?'loss':'losses';
	return num.toString()+' '+wins;
}
function getGameDetails(obj, lastGameSkillNum, totalProfit, lastProfit) {
	var list1 = ["devastating", "large", "small", "little", "decent", "monster"];
	var list2 = ["painful", "sharp", "slim", "slight", "respectable", "huge"];
	var list3 = ["crushing", "severe", "moderate", "modest", "large", "tremendous"];
	var adjectGame = list1[lastGameSkillNum];

        if(obj.numGames%3==0)
            adjectGame = list2[lastGameSkillNum];

        if(obj.numGames%3==1)
            adjectGame = list3[lastGameSkillNum];

	var cCounter = obj.numGames%6;
	var lastGameDetails = '';
	
	var winLoss = (obj.lastGame.profit>=0)?'win':'loss';
	if(obj.profit<0) {
		if(obj.lastGame.profit<0) {
			switch (cCounter) {
				case 0:
					lastGameDetails = "You've now lost "+totalProfit+" recently after dropping another "+lastProfit+" at "+obj.lastGame.location+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+".";
					break;
				case 1:
					lastGameDetails = "You got rolled "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" where you added to your losses by donking off another "+lastProfit+".";
					break;
				case 2:
					lastGameDetails = ""+obj.lastGame.weekday+" wasn't a good poker "+obj.lastGame.daytime+" for you as you lost another "+lastProfit+", pushing your bankroll to negative "+totalProfit+".";
					break;
				case 3:
					lastGameDetails = "Your recent losses have now totaled "+totalProfit+" after dropping another "+lastProfit+" at "+obj.lastGame.location+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+"."
					break;
				case 4:
					lastGameDetails = "Your current slump continued "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" where your 'any-two-cards' strategy resulted in a "+adjectGame+" loss of "+lastProfit+".";
					break;
				case 5:
					lastGameDetails = ""+obj.lastGame.weekday+" was another saunter into the poker room. Different "+obj.lastGame.daytime+" same story. The result was another "+adjectGame+" loss ("+lastProfit+"), pushing your bankroll to negative "+totalProfit+".";
					break;
			}
		} else {
			switch (cCounter) {
				case 0:
					lastGameDetails = "You were able to squeeze out a "+adjectGame+" "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" in an effort to stop the bleeding and hopefully get things moving in the right direction.";
					break;
				case 1:
					lastGameDetails = "Winning "+lastProfit+" at "+obj.lastGame.location+" "+obj.lastGame.weekday+" was a step in the right direction, but you are still down "+totalProfit+" in recent play.";
					break;
				case 2:
					lastGameDetails = "It was nice to walk away with a "+adjectGame+" "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+", but you are going to need a few more of those to dig out of the current hole you are in.";
					break;
				case 3:
					lastGameDetails = "In a rare spark of good play, you were able to win a "+adjectGame+" "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+". This will hopefully get things moving in the right direction.";
					break;
				case 4:
					lastGameDetails = "With a "+adjectGame+" "+lastProfit+" win at "+obj.lastGame.location+" "+obj.lastGame.weekday+" you are now moving things in the right direction. The bad news is you are still down "+totalProfit+" in recent play.";
					break;
				case 5:
					lastGameDetails = "The good news is you were able to walk away with a "+adjectGame+" "+winLoss+" of "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+". The bad news is you still have a ways to go to dig out of the current hole you are in.";
					break;
			}
		}
	} else {
		if(obj.lastGame.profit<0) {
			switch (cCounter) {
				case 0:
					lastGameDetails = ""+obj.lastGame.weekday+" "+obj.lastGame.daytime+" took a "+adjectGame+" "+lastProfit+" hit to your bankroll but you are still in the black overall in recent games.";
					break;
				case 1:
					lastGameDetails = "You took it on the chin "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" as a few small mistakes added up to a "+lastProfit+" losing session. The good news is you are still up "+totalProfit+" in recent games.";
					break;
				case 2:
					lastGameDetails = "A "+adjectGame+" loss "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" was not good but you are still up "+totalProfit+" in recent games.";
					break;
				case 3:
					lastGameDetails = ""+obj.lastGame.weekday+" was an off "+obj.lastGame.daytime+" for you losing a "+adjectGame+" "+lastProfit+" but you are still in the black overall in recent games.";
					break;
				case 4:
					lastGameDetails = "A "+adjectGame+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" took a bite out of your bankroll, but the good news is you are still up overall in recent games.";
					break;
				case 5:
					lastGameDetails = "You managed a "+adjectGame+" "+lastProfit+" loss "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" but shake it off. You are still up "+totalProfit+" in recent games.";
					break;
			}
		} else {
			switch (cCounter) {
				case 0:
					lastGameDetails = "A "+adjectGame+" "+lastProfit+" win "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" is helping you keep a positive bankroll in recent games.";
					break;
				case 1:
					lastGameDetails = "You are now up "+totalProfit+" in recent games thanks to a "+adjectGame+" "+lastProfit+" win at "+obj.lastGame.location+" on "+obj.lastGame.weekday+".";
					break;
				case 2:
					lastGameDetails = ""+obj.lastGame.weekday+" "+obj.lastGame.daytime+" was proof of your good play when you were able to add an additional "+lastProfit+" to your bankroll.";
					break;
				case 3:
					lastGameDetails = "Not too shabby with a "+adjectGame+" "+lastProfit+" win "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+". Your recent play is helping you keep a positive bankroll.";
					break;
				case 4:
					lastGameDetails = "After another win, you are now up "+totalProfit+" in recent games. You are extending your positive bankroll thanks to a "+adjectGame+" "+lastProfit+" win at "+obj.lastGame.location+" on "+obj.lastGame.weekday+".";
					break;
				case 5:
					lastGameDetails = ""+obj.lastGame.weekday+" "+obj.lastGame.daytime+" was another "+adjectGame+" session for you as you were able to add an additional "+lastProfit+" to your bankroll.";
					break;
			}
		}			
	}
	// "+totalProfit+" "+lastProfit+" "+obj.lastGame.location+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" "+adjectGame+" "+winLoss+"
	if(obj.lastGame.rebuyAmount>0) {
		if(obj.lastGame.profit >0)
			lastGameDetails = "Nice work "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" as you took some early losses but were able to turn it into a winning session cashing out for "+lastProfit+" profit.";
		if(obj.lastGame.profit<0 && obj.lastGame.profit*-1<obj.lastGame.buyin)
			lastGameDetails = "Well it could have been worse "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" as you dug yourself into a hole early but were able to recover some of the losses to finish off just down "+lastProfit+".";
		
		if(obj.lastGame.profit<0 && obj.lastGame.profit*-1>obj.lastGame.buyin)
			lastGameDetails = "Ouch! "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" started out bad and quickly went downhill from there. Not a good session as you dropped "+lastProfit+".";
		
	}
	if(obj.lastGame.profit>0 && obj.profit>0 && obj.profit<obj.lastGame.profit)
		lastGameDetails = "Raking in "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" was enough to push your overall recent game bankroll positive, so things are really looking up.";
	
	if(obj.lastGame.profit<0 && obj.profit<0 && obj.profit>obj.lastGame.profit)
		lastGameDetails = "Unfortunately losing "+lastProfit+" "+obj.lastGame.weekday+" "+obj.lastGame.daytime+" at "+obj.lastGame.location+" was enough to push your overall recent game bankroll into the red, so its time to buckle up and focus on solid poker.";

	return lastGameDetails;
}

function getOpeningAndClosingLines(lastGameSkillNum, streak, obj) {
	var numGamesThisYear = obj.numGames || 10; // fix this

//	console.log('getOpeningAndClosingLines', overallSkillNum, lastGameSkillNum, streak);
	var opening = '';
	var closing = '';
        switch (obj.overallSkillNum) {
			case 0:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "Yikes! Just when you thought your game could not get any worse, guess what? Its getting worse.";
							closing = "This is pretty bad. Not only have you proven that you can lose, but that you can lose big.";
						} else { 
							opening = "This month started out on a bad note and has gone downhill quickly from there. And I'm talking about your better games.";
							closing = "I'm not sure if there has ever been a worse poker player. There was once this guy in Chattanooga that was pretty bad, but wait, no he won a game once.";
						}
						break;
					case 1:
						if(streak==-1) {
							opening = "It's very possible that maybe poker is not your best game. Are you even looking at your cards before making those horrible bets?";
							closing = "Hmmm... this is flat out ugly. Maybe a trip to your local book store to pick up Poker for Dummies?";
						} else { 
							opening = "Calling your poker play a train wreck is giving you too much credit. This is a nuclear powered train crashing into the Titanic at Chernobyl!";
							closing = "I am going to recommend some books to help you out. Starting with Gardening for Dummies. I think that might be a better use of your time.";
						}
						break;
					case 2:
						if(streak==-1) {
							opening = "It's very possible that maybe poker is not your best game. Are you even looking at your cards before making those horrible bets?";
							closing = "Hmmm... this is flat out ugly. Maybe a trip to your local book store to pick up Poker for Dummies?";
						} else { 
							opening = "Calling your poker play a train wreck is giving you too much credit. This is a nuclear powered train crashing into the Titanic at Chernobyl!";
							closing = "I am going to recommend some books to help you out. Starting with Gardening for Dummies. I think that might be a better use of your time.";
						}
						break;
					case 3:
						if(streak==1) {
							opening = "Whoa. You won some chips? Who were you playing against? Your grandma at the retirement home?";
							closing = "Every win helps, but you really need to work on the game fundamentals.";
						} else { 
							opening = "This poker game of yours flat out sucks, but we are starting to see some signs of improvement.";
							closing = "There might be a little hope in this disaster of a poker game you have.";
						}
						break;
					case 4:
						if(streak==1) {
							opening = "Finally! At last a winning game after all the recent carnage.";
							closing = "Now that you have discovered how to win at poker, maybe you can start climbing out of the hole your bankroll is currently in.";
						} else { 
							opening = "Two good games in a row? I'm shocked! Who is coaching you? That guy deserves an award.";
							closing = "We are almost ready to start calling you a fish and, believe me, with your poker game that's a huge compliment.";
						}
						break;
					case 5:
						if(streak==1) {
							opening = "Wow! Even a blind squirrel finds a nut once in a while! And tonight, my friend, this was your blind squirrel night.";
							closing = "Hopefully this latest game is a sign that you have discovered new talents because otherwise... well lets not think about the otherwise.";
						} else { 
							opening = "I don't know what you changed recently, but whatever is was, don't go back to your old style!";
							closing = "Keep it going. Some day they will write books about you... the Little Donkey who Could.";
						}
						break;
				}
			case 1:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "This is like watching a heavy-weight prize fighter. A prize fighter who's getting his lights knocked out, that is.";
							closing = "The great thing about poker is that you are only one cash-machine visit away from being back in the game! It might be time to try some new strategies. This 'any two cards' strategy is not going so well.";
						} else {
							opening = "Poker is a game of patience and bet sizing. You have demonstrated a remarkable deficientcy in both.";
							closing = "I am going to recommend some books to help you out. Starting with Gardening for Dummies. I think that might be a better use of your time.";
						}

						break;
					case 1:
						if(streak==-1) {
							opening = "Oh my. You've been playing pretty bad poker lately... and its getting worse.";
							closing = "Have you considered taking up tennis? Maybe golfing? Bingo might be better suited for your 'talents'.";
						} else {
							opening = "The bad breaks keep coming and they don't stop coming. Who taught you how to play poker anyways? I mean, come on!";
							closing = "You need to turn this game around and turn it around fast. Because you are quickly approaching donkey territory!";
						}
						
						break;
					case 2:
						if(streak==-1) {
							opening = "Oh my. You've been playing pretty bad poker lately... and its getting worse.";
							closing = "Have you considered taking up tennis? Maybe golfing? Bingo might be better suited for your 'talents'.";
						} else {
							opening = "The bad breaks keep coming and they don't stop coming. Who taught you how to play poker anyways? I mean, come on!";
							closing = "You need to turn this game around and turn it around fast. Because you are quickly approaching donkey territory!";
						}
						
						break;
					case 3:
						if(streak==1) {
							opening = "Ok here we go. Nothing like winning some money at the poker table to put a smile on your face.";
							closing = "Your game needs some fine tuning but its starting to show some flashes of... well... ok'ness.";
						} else {
							opening = "Finally you are starting to play like you know what you are doing.";
							closing = "After winning 2 in a row I think you may finally be playing some good poker. Or at least less-bad poker.";
						}
						
						break;
					case 4:
						if(streak==1) {
							opening = "You have played some pretty bad poker lately, but things might be starting to turn around.";
							closing = "Nice job on the last game. Hopefully the good play and big wins continue.";
						} else {
							opening = "Now you are starting to get in a rhythm. You keep this up and we might stop calling you a fish.";
							closing = "Nice little streak of 2 wins in a row. Keep it going.";
						}
						
						break;
					case 5:
						if(streak==1) {
							opening = "Amazing! Wins have been kinda rare for you lately and this was not just a win, but a big win!";
							closing = "This latest win helps put a bandaid over the bloodbath that's been your bankroll lately.";
						} else {
							opening = "Pow! Another big win for the little guy who's been fighting to be taken seriously at the poker table.";
							closing = "You are finally digging your way out of the hole. And digging out quickly. Keep it up.";
						}
						
						break;
				}
				break;
			case 2:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "This is like watching a heavy-weight prize fighter. A prize fighter who's getting his lights knocked out, that is.";
							closing = "The great thing about poker is that you are only one cash-machine visit away from being back in the game! It might be time to try some new strategies. This 'any two cards' strategy is not going so well.";
						} else {
							opening = "Poker is a game of patience and bet sizing. You have demonstrated a remarkable deficientcy in both.";
							closing = "I am going to recommend some books to help you out. Starting with Gardening for Dummies. I think that might be a better use of your time.";
						}

						break;
					case 1:
						if(streak==-1) {
							opening = "Oh my. You've been playing pretty bad poker lately... and its getting worse.";
							closing = "Have you considered taking up tennis? Maybe golfing? Bingo might be better suited for your 'talents'.";
						} else {
							opening = "The bad breaks keep coming and they don't stop coming. Who taught you how to play poker anyways? I mean, come on!";
							closing = "You need to turn this game around and turn it around fast. Because you are quickly approaching donkey territory!";
						}
						
						break;
					case 2:
						if(streak==-1) {
							opening = "Oh my. You've been playing pretty bad poker lately... and its getting worse.";
							closing = "Have you considered taking up tennis? Maybe golfing? Bingo might be better suited for your 'talents'.";
						} else {
							opening = "The bad breaks keep coming and they don't stop coming. Who taught you how to play poker anyways? I mean, come on!";
							closing = "You need to turn this game around and turn it around fast. Because you are quickly approaching donkey territory!";
						}
						
						break;
					case 3:
						if(streak==1) {
							opening = "Ok here we go. Nothing like winning some money at the poker table to put a smile on your face.";
							closing = "Your game needs some fine tuning but its starting to show some flashes of... well... ok'ness.";
						} else {
							opening = "Finally you are starting to play like you know what you are doing.";
							closing = "After winning 2 in a row I think you may finally be playing some good poker. Or at least less-bad poker.";
						}
						
						break;
					case 4:
						if(streak==1) {
							opening = "You have played some pretty bad poker lately, but things might be starting to turn around.";
							closing = "Nice job on the last game. Hopefully the good play and big wins continue.";
						} else {
							opening = "Now you are starting to get in a rhythm. You keep this up and we might stop calling you a fish.";
							closing = "Nice little streak of 2 wins in a row. Keep it going.";
						}
						
						break;
					case 5:
						if(streak==1) {
							opening = "Amazing! Wins have been kinda rare for you lately and this was not just a win, but a big win!";
							closing = "This latest win helps put a bandaid over the bloodbath that's been your bankroll lately.";
						} else {
							opening = "Pow! Another big win for the little guy who's been fighting to be taken seriously at the poker table.";
							closing = "You are finally digging your way out of the hole. And digging out quickly. Keep it up.";
						}
						
						break;
				}
				break;
			case 3:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "Poker is a game of highs and lows and right now you are playing off a low.";
							closing = "The goal is to brush off the recent loss and get back to winning.";
						} else {
							opening = "Back to back craps. Crappy games that is. Times is tough.";
							closing = "It's now time to turn this game around and get back to winning.";
						}
						break;
					case 1:
						if(streak==-1) {
							opening = "Another rough outing at the poker tables but at least you walked away with some chips.";
							closing = "The good news is that even with your losses you are generally playing smart and making good folds. Keep it going with the next game.";
						} else {
							opening = "The bad beats keep coming and they don't stop coming. This is not shaping up to be a good week.";
							closing = "Going through small slumps is part of the game. No big deal. Concentrate on solid poker and you will be fine.";
						}						
						break;
					case 2:
						if(streak==-1) {
							opening = "Another rough outing at the poker tables but at least you walked away with some chips.";
							closing = "The good news is that even with your losses you are generally playing smart and making good folds. Keep it going with the next game.";
						} else {
							opening = "The bad beats keep coming and they don't stop coming. This is not shaping up to be a good week.";
							closing = "Going through small slumps is part of the game. No big deal. Concentrate on solid poker and you will be fine.";
						}						
						break;
					case 3:
						if(streak==1) {
							opening = "Nice job on your last game. Grinding out wins and playing very steady, solid poker is what it's all about.";
							closing = "The important thing is to keep playing solid poker, keep making great laydowns, and don't get crazy with the bluffs.";
						} else {
							opening = "Another day, another win. You are making some good bets and good folds lately which is leading to positive stats.";
							closing = "Keep the winning streak going by playing good poker and making great laydowns.";
						}
						break;
					case 4:
						if(streak==1) {
							opening = "Great job pulling off a win. Things are looking much better after that last game.";
							closing = "Playing solid poker is the key to this game. Keep it up.";
						} else {
							opening = "Not bad not bad. Another solid win for the good guys.";
							closing = "Now that you have your game dialed in, you are ready to start winning some serious cash.";
						}
						break;
					case 5:
						if(streak==1) {
							opening = "Great game! Poker is so much better when you are winning. And winning big.";
							closing = "This might be the time for you to break out and become a really great poker player.";
						} else {
							opening = "Sha-Powie! Your game is on fire. There might be another shark in the shark tank soon.";
							closing = "This is the type of poker you have been wanting to play. Keep it going and keep the wins rolling.";
						}
						break;
				}
				break;
			case 4:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "Well, no one wins them all and this last game is proof of that.";
							closing = "Time to shake off the loss and move on to the next game.";
						} else {
							opening = "The slide continues as you are reminded that poker has its ups and downs... and the downs really suck.";
							closing = "I hope we aren't seeing a new bad trend after all those earlier wins.";
						}
						
						break;
					case 1:
						if(streak==-1) {
							opening = "You hit a small speed bump with that last game, but overall you've been playing some great poker lately.";
							closing = "Nobody wins every game, but you've been playing solid poker as of late. keep it up.";
						} else {
							opening = "Another loss hurts the bankroll a little, but that's small potatoes for a good player like you.";
							closing = "The losses are piling up. It's time to get the game back on track.";
						}
						
						break;
					case 2:
						if(streak==-1) {
							opening = "You hit a small speed bump with that last game, but overall you've been playing some great poker lately.";
							closing = "Nobody wins every game, but you've been playing solid poker as of late. keep it up.";
						} else {
							opening = "Another loss hurts the bankroll a little, but that's small potatoes for a good player like you.";
							closing = "The losses are piling up. It's time to get the game back on track.";
						}
						
						break;
					case 3:
						if(streak==1) {
							opening = "Alright alright... a win and now the bankroll is moving in the right direction again.";
							closing = "Keep the wins coming and keep playing the same solid poker.";
						} else {
							opening = "It's nice to see you are back on a winning streak and playing good poker.";
							closing = "This current little winning streak is helping keep your money on a positive cash flow.";
						}
						
						break;
					case 4:
						if(streak==1) {
							opening = "Great game. Great poker. Poker is fun when you are walking away from the table with chips.";
							closing = "Nice job getting your game back on track with the recent win. Keep it going.";
						} else {
							opening = "Nice Win! You are giving donkey players the business and discarding them like yesterday's news!";
							closing = "For people like you, winning is just a way of life.";
						}
						
						break;
					case 5:
						if(streak==1) {
							opening = "Spectacular! Nice to get back on a winning note. You've been playing some great poker lately and its getting even better.";
							closing = "Now that you are back to winning, it's time to put the car in high gear and really dominate the tables.";
						} else {
							opening = "Win Win Win! Rack 'em up, stack 'em up. Stacking up chips that is.";
							closing = "Keep the momentum going! It may be time to drop the hammer on these chumps.";
						}
						
						break;
				}
				break;
			case 5:
				switch (lastGameSkillNum) {
					case 0:
						if(streak==-1) {
							opening = "No problem. You've played some great poker lately even though the last game was a blank.";
							closing = "March right back into the poker room and focus on getting back on a winning streak.";
						} else {
							opening = "Two losses in a row? Even great players go through their slumps, so shake it off.";
							closing = "Don't lose your concentration and don't make calls when you know you are beat.";
						}
						break;
					case 1:
						if(streak==-1) {
							opening = "Overall, great poker being played, even though the last game wasn't so good.";
							closing = "Keep playing the same solid poker you're known for playing and let the chips fall where they will.";
						} else {
							opening = "Slumps are no fun and you've been taking a few hits lately, but keep your head up. Shake it off.";
							closing = "Get back to the basics and focus on winning big pots. Don't be afraid of going into fold mode when the cards aren't coming your way.";
						}
						
						break;
					case 2:
						if(streak==-1) {
							opening = "Overall, great poker being played, even though the last game wasn't so good.";
							closing = "Keep playing the same solid poker you're known for playing and let the chips fall where they will.";
						} else {
							opening = "Slumps are no fun and you've been taking a few hits lately, but keep your head up. Shake it off.";
							closing = "Get back to the basics and focus on winning big pots. Don't be afraid of going into fold mode when the cards aren't coming your way.";
						}
						
						break;
					case 3:
						if(streak==1) {
							opening = "Great job breaking your slump with that latest win. This game of yours is flat out solid right now.";
							closing = "Its time to rev this game into high gear and go for a really big cashout.";
						} else {
							opening = "Now your back to playing good poker! Two wins in a row is padding the ol' bank account.";
							closing = "You have a solid game right now and are making all the right calls. Now it's time to extend this winning streak and really show them what you have.";
						}
						
						break;
					case 4:
						if(streak==1) {
							opening = "Fantastic! Nice job getting back to a winning streak. You are looking like a true champion as of late.";
							closing = "You are making this game look easy! But then again this game is easy when you have your skills.";
						} else {
							opening = "One big win after another. You are making this game look easy.";
							closing = "Now is not the time to get an inflated ego though... even if you are one of the greatest players of all time!";
						}
						
						break;
					case 5:
						if(streak==1) {
							opening = "Great job getting back on a winning track with another big win. Putting the rare losses aside, you are playing some great poker right now!";
							closing = "Don't get too overconfident though. Wait, what am I talking about? Its hard not to be confident when you are the shark, swimming in the fish tank.";
						} else {
							opening = "It doesn't get any better than this! Masterful poker being played by one of poker's greats.";
							closing = "It's time to quit your day job and just play poker... all day... every day.";
						}
						
						break;
				}
				break;
		}
	if(streak==3 && obj.numGames%2==0) {
		opening = "Good work! Things are rolling now after winning your third game in a row!";
		closing = "Keep the gravy train rumbling as you prepare for your next game.";
	}
	if(streak==3 && obj.numGames%2==1) {
		opening = "Another win! Nice work getting your third winning game in a row!";
		closing = "Keep your focus as you prepare to extend the winning streak.";
	}
	if(streak==4) {
		opening = "Outstanding! Four wins in a row for you. Its almost like taking candy from a baby.";
		closing = "Keep the pressure on and go for win #5!";
	}
	if(streak==5) {
		opening = "This has been some unbelievable poker play as you just cruised to your fifth win in a row!";
		closing = "Don't change your game now as you try for win #6";
	}
	if(streak==6) {
		opening = "Wow! Six wins in a row? Are you serious? This is a serious winning streak.";
		closing = "Whatever you've been doing lately is working, so keep it going.";
	}
	if(streak==7) {
		opening = "Somebody pinch me. Did you really just win your 7th game in a row? Outstanding!";
		closing = "I don't know how you find so many fish at one table, but hopefully the good fortune continues.";
	}
	if(streak==8) {
		opening = "Great work getting your eighth straight win!";
		closing = "Whatever you've been doing lately is working, so keep it going.";
	}
	if(streak==9) {
		opening = "Dynomite! Good work rolling up your ninth straight win.";
		closing = "I don't know how you find so many fish at one table, but hopefully the good fortune continues.";
	}
	if(streak==10) {
		opening = "Superb! You just racked up your tenth straight win!";
		closing = "Whatever you've been doing lately is working, so keep it going.";
	}
	
	if(streak==-3 && numGamesThisYear%2==0) {
		opening = "Doh! Times are tough right now as you've come up short in three straight games.";
		closing = "You are due for a win so concentrate on good play and don't... I repeat don't go on tilt!";
	}
	if(streak==-3 && numGamesThisYear%2==1) {
		opening = "Ouch! Three straight losses is not good for the ol' bankroll.";
		closing = "You need to start getting better value out of your good hands. If you are winning the small pots and losing the big pots, you need to change things up.";
	}
	if(streak==-4) {
		opening = "Yuk! The onslaught is getting more severe as you have now lost 4 games in a row.";
		closing = "I don't want to get nasty, so make sure you bring your 'A' game next time.";
	}
	if(streak==-5) {
		opening = "These are certainly not the best of times, and may very well be the worst of times as you have now lost 5 straight games.";
		closing = "Whatever you've been doing lately, try the exact opposite, because it's simply not working.";
	}
	if(streak==-6) {
		opening = "Six bad games in a row! Its either bad luck or bad play but right now I'm leaning towards bad play.";
		closing = "Make sure you eat a big meal and get lots of rest before going to your next game. You're gunna need it.";
	}
	if(streak==-7) {
		opening = "UGH! It doesn't get any worse than this. Seven poor games in a row with no signs of improvement.";
		closing = "This is it. You better win next game out because your bank account can't handle much more of this disaster.";
	}
	if(streak==-8) {
		opening = "No. No. No. This is so bad. Eight straight losses!";
		closing = "Whatever you've been doing lately, try the exact opposite, because it's simply not working.";
	}
	if(streak==-9) {
		opening = "I can't believe what I am seeing! Nine straight losses?!?";
		closing = "Make sure you eat a big meal and get lots of rest before going to your next game. You're gunna need it.";
	}
	if(streak==-10) {
		opening = "Are you kidding me? Is this a joke? Ten losses in a row?!?";
		closing = "This is it. You better win next game out because your bank account can't handle much more of this disaster.";
	}
	return [opening, closing];
} //<-- getOpeningAndClosingLines


function getCaroQuoteForNumber(num) {
	var quotes = [
"\"Learning to play two pairs is worth about as much as a college education, and about as costly.\"\n  -- Mark Twain",
"\"Limit poker is a science, but no-limit is an art. In limit, you are shooting at a target. In no-limit, the target comes alive and shoots back at you.\"\n-Jack Strauss",
"If I had a dollar for each poker player who stuck to a disciplined strategy for a whole day, I could make a down payment on a deck of cards. - Mike Caro.",
"\"The guy who invented poker was bright, but the guy who invented the chip was a genius.\"\n-- Julius Weintraub",
"\"Cards are war, in disguise of a sport.\"\n-- Charles Lamb",
"In poker, money eventually flows from bad players to good players. Nothing else is possible. - Mike Caro",
"\"Poker may be a branch of psychological warfare, an art form or indeed a way of life; but it is also merely a game, in which money is simply the means of keeping score.\"\n-- Anthony Holden",
"\"The strong point in poker is never to lose your temper, either with those you are playing with or, more particularly, with the cards.\"\n-William J. Florence",
"Remember there's a sucker at every table. So if, after the first twenty minutes, you can't spot the sucker... it's you!",
"False hope is sometimes much worse and sometimes much better than no hope. - Mike Caro.",
"\"Aces are larger than life and greater than mountains.\"\n-- Mike Caro",
"\"It's not enough to succeed. Others must fail.\"\n - Gore Vidal",
"\"Poker exemplifies the worst aspects of capitalism that have made our country so great.\"\n- Walter Matthau",
"Powerless people have no rights, except the right to hope that powerful people will not abuse them. - Mike Caro",
"\"Baseball is like a poker game. Nobody wants to quit when he's losing; nobody wants you to quit when you're ahead.\"\n-Jackie Robinson",
"\"I hope to break even this week. I need the money.\"\n--annonymous gambler",
"Adventurers tend to prance about the ladder of success, fearing less the sensation of a great fall than the humility of hanging idle. - Mike Caro",
"\"A Smith & Wesson beats four aces.\"\n-- famous American proverb",
"Trying to trick an opponent can leave you both confused. - Mike Caro",
"\"At gambling, the deadly sin is to mistake bad play for bad luck.\"\n-- Ian Fleming",
"\"Neither I nor anyone else can guarantee you will win. If someone tells you they can, do not believe them. Run making sure you have a death grip on your wallet.\"\n-Ken Pearlman",
"\"The smarter you play, the luckier you'll be.\"\n-Mark Pilarski",
"If people can be shocked, outraged, or repulsed, others will make this happen, just to watch. - Mike Caro",
"\"No wife can endure a gambling husband unless he is a steady winner.\"\n-Lord Dewar",
"\"Judged by the dollars spent, gambling is now more popular in America than baseball, the movies, and Disneyland-combined.\"\n-Timothy L. O'Brien",
"\"Luck never gives; it only lends\"\n-- Swedish Proverb",
"If you speak the truth, you spoil the game.  - Mike Caro",
"\"They gambled in the Garden of Eden, and they will again if there's another one.\"\n-- Richard Albert Canfield",
"\"The commonest mistake in history is underestimating your opponent; it happens at the poker table all the time.\"\n-David Shoup",
"\"Poker's a day to learn and a lifetime to master.\"\n  ~Robert Williamson III",
"Don�t wait for the law of averages to make luck break even.  - Mike Caro",
"\"I never go looking for a sucker. I look for a Champion and make a sucker of of him.\"\n- Slim Preston",
"\"Poker is a lot like sex, everyone thinks they are the best, but most don't have a clue what they are doing!\"\n - Dutch Boy'd",
"\"Hold'em is a game of calculated aggression: Any cards good enough to call, are good enough to raise.\"\n-- Alfred Alvarez",
"In the beginning, everything was even money.  - Mike Caro",
"\"Show me a good loser and I'll show you a loser.\"\n - Stu Ungar",
"\"If you reraise a raiser, and he doesn't raise you back, you know he has kicker problems.\"\n-- Crandall Addington",
"\"Sometimes you'll miss a bet, sure, but it's OK to miss a bet. Poker is an art form, of course, but sometimes you have to sacrifice art in favour of making a profit.\"\n - Mike Caro",
"The truth can be straight ahead or hide around the corner. The truth can hover above or be buried beneath. Never forget to look back, because the truth is often left behind.  - Mike Caro",
"\"Poker is a microcosm of all we admire and disdain about capitalism and democracy.\"\n- Lou Krieger",
"If choices are not clearly connected to their benefits, people usually interact in ways that make outcomes unpredictable. - Mike Caro",
"\"One day a chump, the next day a champion. What a difference a day makes in tournament poker.\"\n-- Mike Sexton",
"\"Most of the money you'll win at poker comes not from the brilliance of your own play, but from the ineptitude of your opponents.\"\n - Lou Krieger",
"If you act like a slot machine, you'll win more than if you act like a vending machine. - Mike Caro",
"Don't whine and don't whimper. Just win. - Mike Caro",
"\"Hold em is to stud what chess is to checkers.\"\n-- Johnny Moss",
"\"It's immoral to let a sucker keep his money.\"\n - Canada Bill Jones",
"\"In the long run there's no luck in poker, but the short run is longer than most people know.\"\n - Rick Bennet",
"\"It is better to let people think you are a bad poker player, then to play and remove all doubt.\"\n -- Michael Gersitz",
"\"Omaha is a game that was invented by a Sadist and is played by Masochists.\"\n-- Shane Smith",
"When victory is beyond reach, don't. - Mike Caro",
"\"The next best thing to gambling and winning is gambling and losing.\"\n - Nick \"The Greek\" Dandalos",
"\"When a man with money meets a man with experience, the man with experience leaves with money and the man with money leaves with experience.\"\n - Anonymous",
"Think about the universe and what it would be like without one. - Mike Caro",
"\"Poker is generally reckoned to be America's second most popular after-dark activity.  Sex is good, they say, but poker lasts longer.\"\n   -- Alfred Alvarez (2001)",
"\"To master poker and make it profitable, you must first master patience and discipline, as a lack of either is a sure disaster regardless of all other talents, or lucky streaks.\"\n   -- Freddie Gasperian",
"Don�t play poker like chess; play poker like poker. - Mike Caro",
"\"The single greatest key to winning is knowing thy enemy... Yourself!\"\n   -- Andy Glazer",
"\"There is a very easy way to return from a casino with a small fortune: go there with a large one.\"\n -- Jack Yelton",
"PTP Poker Advice: Reliable Tells. A player with shaking hands or trys to goad you into calling by saying something like, 'I think you are bluffing' has a monster. Be very cautious. On the other hand, a player that stares you down or directs his bet towards you in an aggressive manor is trying to intimidate and is hoping for a fold.",
"\"Poker is not a game in which the meek inherit the earth.\"\n -- David Hayano",
"\"There is more to poker than life.\"\n   -- Tom McEvoy",
"Telling the truth is spreading false misinformation. - Mike Caro",
"\"Poker is a combination of luck and skill. People think mastering the skill part is hard, but they're wrong. The trick to poker is mastering the luck.\"\n -- Jesse May",
"\"If you play bridge badly you make your partner suffer, but if you play poker badly you make everybody happy.\"\n -- Joe Laurie Jr",
"\"There's opportunity in poker.... If Horace Greeley were alive today, his advice wouldn't be 'Go West, young man, and grow up with the country.' Instead, he'd point to that deck of cards on table and say, 'Shuffle up and deal!' \"\n -- Lou Krieger",
"\"The ignorance of the people is fearful. Why, I have known clergymen, good men, kind-hearted, sincere, and all that, who did not know the meaning of a flush. It is enough to make one ashamed of the species.\"\n -- Mark Twain",
"\"People would be surprised to know how much I learned about prayer from playing poker.\"\n -- Mary Austin",
"Good poker decisions include many factors. Winning the pot isn't one of them. - Mike Caro",
"\"A dollar won is twice as sweet as a dollar earned.\"\n -- Paul Newman",
"\"Last night I stayed up late playing poker with Tarot cards. I got a full house and four people died.\"\n -- Steven Wright",
"\"Your best chance to get a Royal Flush in a casino is in the bathroom.\"\n -- VP Pappy",
"Poker isn�t a game of reducing risk. It�s a game of inviting risk with an advantage. - Mike Caro",
"\"Lottery: A tax on gamblers who are bad at math.\"\n -- Unknown",
	];
	return quotes[num%quotes.length];
}

function getQuoteForNumber(num) {
	var quotes = [
"\"Learning to play two pairs is worth about as much as a college education, and about as costly.\"\n  -- Mark Twain",
"\"Limit poker is a science, but no-limit is an art. In limit, you are shooting at a target. In no-limit, the target comes alive and shoots back at you.\"\n-Jack Strauss",
"PTP Poker Advice: Never bust out with top pair. Weak players hit top pair and they think they just won the lottery. Donkeys will call any bet with top pair but good players can easily fold it when they sense danger. Similarly, never call with top pair: re-raise or fold.",
"\"The guy who invented poker was bright, but the guy who invented the chip was a genius.\"\n-- Julius Weintraub",
"\"Cards are war, in disguise of a sport.\"\n-- Charles Lamb",
"PTP Poker Advice: With a large number of people in the hand, it is best to bet the flop when you pair your ace, regardless of kicker. An ace on the board gives everyone some kind of straight draw so giving a free card is a mistake, even if you hold pocket aces.",
"\"Poker may be a branch of psychological warfare, an art form or indeed a way of life; but it is also merely a game, in which money is simply the means of keeping score.\"\n-- Anthony Holden",
"\"The strong point in poker is never to lose your temper, either with those you are playing with or, more particularly, with the cards.\"\n-William J. Florence",
"Remember there's a sucker at every table. So if, after the first twenty minutes, you can't spot the sucker... it's you!",
"PTP Poker Advice: Never slow play 2-pair. It feels like a monster when it hits but is easily counterfeited. More money is lost with 2-pair than any other hand.",
"\"Aces are larger than life and greater than mountains.\"\n-- Mike Caro",
"\"It's not enough to succeed. Others must fail.\"\n - Gore Vidal",
"\"Poker exemplifies the worst aspects of capitalism that have made our country so great.\"\n- Walter Matthau",
"PTP Poker Advice: Never chase flushes and straights heads up. Having 3 or more players in a hand gives you pot odds to chase flushes, but heads up is generally bad poker.",
"\"Baseball is like a poker game. Nobody wants to quit when he's losing; nobody wants you to quit when you're ahead.\"\n-Jackie Robinson",
"\"I hope to break even this week. I need the money.\"\n--annonymous gambler",
"PTP Poker Advice: The biggest difference between good and great players is skilled bet sizing. Strong players bet based, not on their own hands, but on their opponents. If they want a call they will bet $1 less than the opponent is willing to fold. If they want a fold, they will bet $1 more than the opponent is willing to call. The strength of their own hand is irrelevant.",
"\"A Smith & Wesson beats four aces.\"\n-- famous American proverb",
"PTP Poker Advice: Play Big-Pot-Poker. Always play for big pots and avoid winning small ones. The object is to build pots if you are ahead and fold if you are behind. Trying to steal a $10 pot with nothing is bad poker!",
"\"At gambling, the deadly sin is to mistake bad play for bad luck.\"\n-- Ian Fleming",
"\"Neither I nor anyone else can guarantee you will win. If someone tells you they can, do not believe them. Run making sure you have a death grip on your wallet.\"\n-Ken Pearlman",
"\"The smarter you play, the luckier you'll be.\"\n-Mark Pilarski",
"PTP Poker Advice: Risk your good hands. Put your good hands in play and don't fear them! Losing $100 with pocket aces is better poker than winning $4 with them.",
"\"No wife can endure a gambling husband unless he is a steady winner.\"\n-Lord Dewar",
"\"Judged by the dollars spent, gambling is now more popular in America than baseball, the movies, and Disneyland-combined.\"\n-Timothy L. O'Brien",
"\"Luck never gives; it only lends\"\n-- Swedish Proverb",
"PTP Poker Advice: Play tight, play aggressive and play smart. Don't be afraid to fold for an hour and don't complain about it either! Being card dead is part of the game and everyone has to deal with it.",
"\"They gambled in the Garden of Eden, and they will again if there's another one.\"\n-- Richard Albert Canfield",
"\"The commonest mistake in history is underestimating your opponent; it happens at the poker table all the time.\"\n-David Shoup",
"\"Poker's a day to learn and a lifetime to master.\"\n  ~Robert Williamson III",
"PTP Poker Advice: Avoid playing pocket pairs heads up. Pocket pairs lose all their value when playing heads up against a raiser. You have a 1 in 8 chance of spiking a set, which makes the math tough to win. Its better to fold or re-raise preflop, because calling a large bet just to fold on the flop is losing poker.",
"\"I never go looking for a sucker. I look for a Champion and make a sucker of of him.\"\n- Slim Preston",
"\"Poker is a lot like sex, everyone thinks they are the best, but most don't have a clue what they are doing!\"\n - Dutch Boy'd",
"\"Hold'em is a game of calculated aggression: Any cards good enough to call, are good enough to raise.\"\n-- Alfred Alvarez",
"PTP Poker Advice: Short Stack Rule - When short stacked, its better to bet 1/3rd of your chips preflop and push all-in on the flop, rather than pushing all-in preflop. By pushing all-in preflop you will either win a tiny pot or be facing a 50% chance of getting knocked out. Both are bad situations. By betting the flop you gain a ton of fold equity.",
"\"Show me a good loser and I'll show you a loser.\"\n - Stu Ungar",
"\"If you reraise a raiser, and he doesn't raise you back, you know he has kicker problems.\"\n-- Crandall Addington",
"\"Sometimes you'll miss a bet, sure, but it's OK to miss a bet. Poker is an art form, of course, but sometimes you have to sacrifice art in favour of making a profit.\"\n - Mike Caro",
"PTP Poker Advice: Slow-play Trips. When 2 matching cards flop giving you trips its almost always best to slow play them. The board is scary so leading out with a bet will generally win you a tiny pot. Besides that if you have kicker problems you don't want the betting too out of control.",
"\"Poker is a microcosm of all we admire and disdain about capitalism and democracy.\"\n- Lou Krieger",
"PTP Poker Advice: The most important skill at the poker table is not math, or reads, or courage or even temperament. It is patience. Those who cannot wait for their opportunity will be throwing money into the pot when it ís someone else's opportunity.",
"\"One day a chump, the next day a champion. What a difference a day makes in tournament poker.\"\n-- Mike Sexton",
"\"Most of the money you'll win at poker comes not from the brilliance of your own play, but from the ineptitude of your opponents.\"\n - Lou Krieger",
"PTP Poker Advice: Flopped Straight Rule: Always bet when you flop a straight because your hand is well disguised and there's a high chance of getting counterfeited.",
"\"Hold em is to stud what chess is to checkers.\"\n-- Johnny Moss",
"\"It's immoral to let a sucker keep his money.\"\n - Canada Bill Jones",
"\"In the long run there's no luck in poker, but the short run is longer than most people know.\"\n - Rick Bennet",
"PTP Poker Advice: Pot Committed Rule: If you are already pot committed and first to act on the river, ALWAYS push all-in no matter how scary the river card is. Checking does no good because if the river card killed you, you are still forced to call any bet, but if you are ahead, you are giving your opponent a free check.",
"\"It is better to let people think you are a bad poker player, then to play and remove all doubt.\"\n -- Michael Gersitz",
"\"Omaha is a game that was invented by a Sadist and is played by Masochists.\"\n-- Shane Smith",
"PTP Poker Quote: If you survey any 10 poker players, all 10 will claim to suffer more bad beats than they dish out. So who is doing all the bad beating?",
"\"The next best thing to gambling and winning is gambling and losing.\"\n - Nick \"The Greek\" Dandalos",
"\"When a man with money meets a man with experience, the man with experience leaves with money and the man with money leaves with experience.\"\n - Anonymous",
"PTP Poker Advice: Reliable Tells. A player who looks long at his hold cards is likely on a very strong draw. always bet big. Also a player who grabs his chips out of turn, in an aggressive manor like he is getting ready to make a big bet is hoping to intimidate you and is likely on a strong draw. Always bet big.",
"\"Poker is generally reckoned to be America's second most popular after-dark activity.  Sex is good, they say, but poker lasts longer.\"\n   -- Alfred Alvarez (2001)",
"\"To master poker and make it profitable, you must first master patience and discipline, as a lack of either is a sure disaster regardless of all other talents, or lucky streaks.\"\n   -- Freddie Gasperian",
"PTP Poker Advice: As a poker player think of yourself as an investor. Investing in your own skills. If you are bullish on your prospects to win, buy in for the max chips and rebuy for the max allowed. If, on the other hand, you expect to lose, buy in for the minimum and leave when your chips run out.",
"\"The single greatest key to winning is knowing thy enemy... Yourself!\"\n   -- Andy Glazer",
"\"There is a very easy way to return from a casino with a small fortune: go there with a large one.\"\n -- Jack Yelton",
"PTP Poker Advice: Reliable Tells. A player with shaking hands or trys to goad you into calling by saying something like, 'I think you are bluffing' has a monster. Be very cautious. On the other hand, a player that stares you down or directs his bet towards you in an aggressive manor is trying to intimidate and is hoping for a fold.",
"\"Poker is not a game in which the meek inherit the earth.\"\n -- David Hayano",
"\"There is more to poker than life.\"\n   -- Tom McEvoy",
"PTP Poker Advice: Never fold with 1/3 of your chips in the pot. Realize, before you bet, that you are making yourself pot committed.",
"\"Poker is a combination of luck and skill. People think mastering the skill part is hard, but they're wrong. The trick to poker is mastering the luck.\"\n -- Jesse May",
"\"If you play bridge badly you make your partner suffer, but if you play poker badly you make everybody happy.\"\n -- Joe Laurie Jr",
"\"There's opportunity in poker.... If Horace Greeley were alive today, his advice wouldn't be 'Go West, young man, and grow up with the country.' Instead, he'd point to that deck of cards on table and say, 'Shuffle up and deal!' \"\n -- Lou Krieger",
"\"The ignorance of the people is fearful. Why, I have known clergymen, good men, kind-hearted, sincere, and all that, who did not know the meaning of a flush. It is enough to make one ashamed of the species.\"\n -- Mark Twain",
"\"People would be surprised to know how much I learned about prayer from playing poker.\"\n -- Mary Austin",
"\"A dollar won is twice as sweet as a dollar earned.\"\n -- Paul Newman",
"\"Last night I stayed up late playing poker with Tarot cards. I got a full house and four people died.\"\n -- Steven Wright",
"\"Your best chance to get a Royal Flush in a casino is in the bathroom.\"\n -- VP Pappy",
"\"Lottery: A tax on gamblers who are bad at math.\"\n -- Unknown",
	];
	return quotes[num%quotes.length];
}
