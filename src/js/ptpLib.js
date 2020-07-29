

function generateAllAnalysis(allGames, obj) {

  var gamesThisYear = [];
  var gamesThisMonth = [];
  var gamesLastMonth = [];
  var gamesLastYear = [];
  var last10Games = [];
  var x = 0;

  allGames.sort((curr, next) => {
    return curr.startTime > next.startTime ? -1 : 1;
  });

  allGames.forEach(game => {
    if (x++ < 10)
      last10Games.push(game);
    if (game.year == obj.year)
      gamesThisYear.push(game);
    if (game.year == obj.year && game.month == obj.month)
      gamesThisMonth.push(game);
    if (game.year == obj.prevYear && game.month == obj.prevMonth)
      gamesLastMonth.push(game);
    if (game.year == obj.year - 1)
      gamesLastYear.push(game);
  });

  var allStatsObj = generateSummaryObj(allGames);
  var thisYearObj = generateSummaryObj(gamesThisYear);
  var thisMonthObj = generateSummaryObj(gamesThisMonth);
  var lastMonthObj = generateSummaryObj(gamesLastMonth);
  var lastYearObj = generateSummaryObj(gamesLastYear);
  var last10Obj = generateSummaryObj(last10Games);

  return {
    last10Stats: populateStatsString(last10Obj, 'Last10'),
    monthStats: populateStatsString(thisMonthObj, netTrackerMonth()),
    yearStats: populateStatsString(last10Obj, obj.year),
    last10Games: last10Games,
    gamesThisYear: gamesThisYear,
    gamesThisMonth: gamesThisMonth,
    gamesLastMonth: gamesLastMonth,
    gamesLastYear: gamesLastYear,
    allStatsObj: allStatsObj,
    thisYearObj: thisYearObj,
    thisMonthObj: thisMonthObj,
    lastMonthObj: lastMonthObj,
    lastYearObj: lastYearObj,
  };
}
function populateStatsString(obj, title) {
  console.log('populateStatsString', obj, title);
  var stats=[];
   stats.push(title);
   stats.push(obj.games);
   stats.push(obj.numGames);
   stats.push(obj.risked);
   stats.push(obj.profit);
   stats.push(obj.streak);
   stats.push(obj.obj.roi);
   stats.push(obj.minutes);
  return stats.join('|');
 }
function getUserObj() {
  return {
    firstName: localStorage.firstName,
    city: localStorage.city,
    state: localStorage.state,
    country: localStorage.country,
    xFlg: localStorage.xFlg,
    gamesOnServer: parseInt(localStorage.gamesOnServer),
    userId: parseInt(localStorage.userId),
    email: localStorage.email
  }
}
function playerTypeObject(risked, profit) {
  var playerTypeObj = {};
  playerTypeObj.name = 'No Data';
  playerTypeObj.number = '99';
  playerTypeObj.roi = 0;
  if (risked > 0) {
    playerTypeObj.roi = parseInt(profit * 100 / risked);
    if (playerTypeObj.roi >= 50) {
      playerTypeObj.name = 'Pro';
      playerTypeObj.number = '5';
    } else if (playerTypeObj.roi >= 25) {
      playerTypeObj.name = 'Shark';
      playerTypeObj.number = '4';
    } else if (playerTypeObj.roi >= 0) {
      playerTypeObj.name = 'Grinder';
      playerTypeObj.number = '3';
    } else if (playerTypeObj.roi >= -20) {
      playerTypeObj.name = 'Rounder';
      playerTypeObj.number = '2';
    } else if (playerTypeObj.roi >= -50) {
      playerTypeObj.name = 'Fish';
      playerTypeObj.number = '1';
    } else {
      playerTypeObj.name = 'Donkey';
      playerTypeObj.number = '0';
    }
  }
  playerTypeObj.roiStr = playerTypeObj.roi + '% (' + playerTypeObj.name + ')';
  playerTypeObj.img = 'playerType' + playerTypeObj.number + '.png';
  return playerTypeObj;
}
function roiString(risked, profit) {
  var obj = playerTypeObject(risked, profit);
  return obj.roiStr;
}
function generateSummaryObj(games) {
  var sortedGames = [];
  games.forEach(game => {
    sortedGames.push(game);
  });
  sortedGames.sort((curr, next) => {
    return curr.startTime < next.startTime ? -1 : 1;
  });
  var numGames = 0;
  var profit = 0;
  var risked = 0;
  var wins = 0;
  var losses = 0;
  var minutes = 0;
  var percent = '-';
  var streak = 0;
  var biggestWin = 0;
  var biggestWin2 = 0;
  var biggestWin3 = 0;
  var biggestLoss = 0;
  var biggestLoss2 = 0;
  var biggestLoss3 = 0;

  sortedGames.forEach(game => {
    numGames++;
    minutes += game.minutes;
    profit += numberVal(game.profit);
    risked += numberVal(game.risked);

    if (game.profit > biggestWin) {
      biggestWin3 = biggestWin2;
      biggestWin2 = biggestWin
      biggestWin = game.profit;
    } else if (game.profit > biggestWin2) {
      biggestWin3 = biggestWin2;
      biggestWin2 = game.profit
    } else if (game.profit > biggestWin3) {
      biggestWin3 = game.profit;
    }

    if (game.profit < biggestLoss) {
      biggestLoss3 = biggestLoss2;
      biggestLoss2 = biggestLoss
      biggestLoss = game.profit;
    } else if (game.profit < biggestLoss2) {
      biggestLoss3 = biggestLoss2;
      biggestLoss2 = game.profit
    } else if (game.profit < biggestLoss3) {
      biggestLoss3 = game.profit;
    }

    if (game.profit >= 0) {
      wins++;
      if (streak > 0)
        streak++;
      else
        streak = 1;
    } else {
      losses++;
      if (streak < 0)
        streak--;
      else
        streak = -1;
    }

  });
  var hourly = '-';
  if (minutes > 0) {
    hourly = formatNumberToLocalCurrency(Math.round(profit * 60 / minutes)) + '/hr';
  }
  if (numGames > 0) {
    percent = Math.round(wins * 100 / numGames) + '%';
  }
  var obj = playerTypeObject(risked, profit);
  var lastGame;
  if (sortedGames.length > 0)
    lastGame = sortedGames[sortedGames.length - 1];
  return {
    games: numGames + ' (' + wins + 'W, ' + losses + 'L) ' + percent,
    numGames: numGames,
    profitStr: formatNumberToLocalCurrency(profit),
    riskedStr: formatNumberToLocalCurrency(risked),
    profit: profit,
    risked: risked,
    wins: wins,
    losses: losses,
    obj: obj,
    biggestWin: biggestWin,
    biggestWin2: biggestWin2,
    biggestWin3: biggestWin3,
    biggestLoss: biggestLoss,
    biggestLoss2: biggestLoss2,
    biggestLoss3: biggestLoss3,
    percent: percent,
    minutes: minutes,
    hours: (minutes / 60).toFixed(1),
    hourly: hourly,
    streak: streak,
    streakStr: streakOfNum(streak),
    overallSkillNum: parseInt(obj.number),
    lastGame: lastGame
  }
}
function streakOfNum(streak) {
  if (streak == 0)
    return '-';
  if (streak > 0)
    return 'W' + streak.toString();
  else
    return 'L' + (streak * -1).toString();
}