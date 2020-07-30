function saveGames(games) {
  localStorage.setItem("ptpGames", JSON.stringify(games));
}
function saveDataToLocalDb(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}
function saveRecordToLocalDb(name, newRecord) {
  var records = loadDataFromLocalDb(name);
  var finalRecords = [];
  records.forEach(record => {
    if (record.id != newRecord.id)
      finalRecords.push(record)
  });
  finalRecords.push(newRecord);
  saveDataToLocalDb(name, finalRecords);
}
function loadDataFromLocalDb(name) {
  var data = localStorage[name];
  if (data)
    return JSON.parse(data);
  else
    return [];
}
function loadGames() {
  var ptpGames = localStorage.ptpGames;
  if (ptpGames) {
    console.log('ptpGames', ptpGames.length);
    var games = JSON.parse(ptpGames);
    var fullGames = [];
    games.forEach(game => {
      scrubGameAndCalculateProfit(game);
      fullGames.push(game)
    });
    return fullGames;
  }
  else
    return [];
}
function getGameOfId(gameId) {
  var games = loadGames();
  var selectedGame;
  games.forEach(game => {
    if (game.id == gameId)
      selectedGame = game;
  });
  return selectedGame;
}
function createNewGame() {
  var games = loadGames();
  var gameId = 1;
  games.forEach(game => {
    if (game.id >= gameId)
      gameId = game.id + 1;
  });
  var newGame = new Object;
  newGame.id = gameId;
  return newGame;
}
function saveThisGame(newGame, addProfitRecordFlg = false) {
  var games = loadGames();
  if (!newGame || !newGame.startTime || !newGame.buyin) {
    console.log("not a game!!!", newGame);
    return 0;
  }
  if (!newGame.id) {
    var newId = 1;
    games.forEach(game => {
      if (game.id >= newId)
        newId = game.id + 1;
    });
    newGame.id = newId;
  }
  if (newGame.status == 'In Progress' && newGame.profitRecords && addProfitRecordFlg) {
    newGame.profitRecords.push({ startTime: newGame.endTime, profit: newGame.profit, gameId: newGame.id });
  }
  newGame = compressedGameFromGame(newGame);

  var newGames = [];
  var newGameCount = 1;
  games.forEach(game => {
    if (game.startTime == newGame.startTime)
      newGameCount = 0;
    else
      newGames.push(game);
  });
  newGames.push(newGame);
  saveGames(newGames);
  if(localStorage.email && localStorage.email.length>0)
    netTrackerUpdate(games, newGame)
  return newGameCount;
}
function deleteThisGame(newGame) {
  var games = loadGames();
  var newGames = [];
  games.forEach(game => {
    if (game.id != newGame.id)
      newGames.push(game);
  });
  saveGames(newGames);
}


function netTrackerUpdate(games, lastGame) {
  console.log('+++netTrackerUpdate+++');

  games.sort((curr, next) => {
    return curr.startTime < next.startTime ? -1 : 1;
  });

  var obj = getDateObjFromJSDate();
  var analysisObj = generateAllAnalysis(games, obj);
  console.log(analysisObj);

  var playFlg = 'N';
  if (lastGame && lastGame.status == 'In Progress')
    playFlg = 'Y';

  var appVersion = 'ptpWeb3.0';

  var last10Stats = analysisObj.last10Stats;
  var monthStats = analysisObj.monthStats;
  var yearStats = analysisObj.yearStats;
  var lastGame = lastGameStats(lastGame, playFlg);
  var last10Games = packageLast10Games(analysisObj.last10Games);
  var versionStats = playFlg + '|' + appVersion + '|$';
  var last90 = packageGameProfits(analysisObj.gamesThisYear);
  var thisMonth = packageGameProfits(analysisObj.gamesThisMonth);
  var last10Reverse = packageGameProfits(analysisObj.last10Games);
  var iconNum = '';
  var themeObj = '';
  var items = [last10Stats, monthStats, yearStats, lastGame, last10Games, versionStats, last90, thisMonth, last10Reverse, iconNum, themeObj];
  var data = items.join('[xx]');

  localStorage.lastUpd = obj.oracle;

  var params =
  {
    Username: localStorage.email,
    code: localStorage.code,
    LastUpd: localStorage.lastUpd,
    Data: data,
    detaText: netTrackerMonth()
  };
  console.log(params);
  executeApiOfFile('pokerUploadUniverseStats.php', params);

}

function getPostDataFromObj(obj) {
  var body = JSON.stringify(obj);

  const postData = {
    method: 'POST',
    headers: new Headers(),
    body: body
  };
  return postData;
}

function executeApiOfFile(file, params) {
  var url = 'https://www.appdigity.com/poker/' + file;
  var postData = getPostDataFromObj(params);
  console.log(url);
  console.log(postData);


  fetch(url, postData).then((resp) => resp.text())
    .then((data) => {
       console.log('pokerUploadUniverseStats', data.length, data);
    })
    .catch(error => {
      console.log(error);
    });

}

function packageGameProfits(games) {
  var list = [];
  games.forEach(function(game) {
    if(game.startTime) {
      var vals = game.startTime.split(' ');
      list.push(vals[0]+'|'+game.profit);
    }
  });
  return list.join(':');
}
function packageLast10Games(games) {
  var list = [];
  games.forEach(function(game) {
    list.push(packagedGame(game));
  });
  list.reverse();
  return 'XX[li]'+list.join('[li]');
}
function packagedGame(game) {
  var items = [];
  items.push(game.startTime);
  items.push(game.buyin);
  items.push(game.rebuyAmount);
  items.push(game.cashout);
  items.push(game.location);
  items.push(game.minutes);
  items.push(game.type);
  items.push('N');
  items.push(game.gametype);
  items.push(game.stakes);
  items.push(game.limitType);
  items.push('');
  items.push(game.endTime);
  items.push('$');
  items.push('0');
  items.push(game.food);
  return items.join('|');
}