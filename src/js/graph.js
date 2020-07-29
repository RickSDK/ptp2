function drawGraph(records, type, graphColor, id = "myCanvas") {
	//format {startTime: this.game.startTime, profit: 0}
	records.sort((curr, next) => {
		return curr.startTime < next.startTime ? -1 : 1;
	});

	var c = document.getElementById(id);
	if (c) {
		var h = window.innerHeight;
		var height = h - 415;
		if (height < 240)
			height = 240;
		c.width = 640;
		c.height = height;
		var leftEdge = 50;
		var rightEdge = 640;
		c.style.width = '100%';
		c.style.height = height + 'px';
		var ctx = c.getContext("2d");
		var hiLow = findHiLow(records);
		drawLeftLabels(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height);
		if (records && records.length > 0) {
			getBottomLabels(ctx, type, leftEdge, rightEdge, c.height, records);
			drawGames(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height - 20, records, type, 0, 0, 0, graphColor);
		}
	} else
		console.log(id + ' not found!');
}
function drawLeftLabels(c, hi, low, leftEdge, rightEdge, height) {
	var spacer = (height - 20) / 11; //20;
	drawRect(c, 0, 0, leftEdge, height, 'white');
	drawRect(c, 0, height - 20, rightEdge, 20, 'white');
	segment = (hi - low) / 11;
	var i = 1;
	var y = -3;
	for (var x = 1; x <= 11; x++) {
		y += spacer;
		drawLine(c, leftEdge, y, rightEdge, y, "#ccc", 1);
		var amount = hi - segment * i++;
		var amountLabel = typicalNumberToMoney(amount, segment <= 1);
		var left = 22 - amountLabel.length * 3;
		writeText(c, amountLabel, left, y + 2, "12px Arial", (amount >= 0) ? "green" : "red");
	}
}

function shortDateFromStartTime(d, range) {
	//var d = convertStringToDate(startTime);
	var day = d.getDate();
	var month = monthName(d);
	var year = d.getFullYear();
	var h = pad(d.getHours());
	var m = pad(d.getMinutes());
	var amPm = 'AM';
	if (h > 12) {
		h -= 12;
		amPm = 'PM';
	}
	if (range < 60 * 60 * 24)
		return h + ':' + m + ' ' + amPm;

	if (range < 60 * 60 * 24 * 60)
		return month.substring(0, 3) + ' ' + day;

	if (range < 60 * 60 * 24 * 30 * 12)
		return month.substring(0, 3);

	if (range < 60 * 60 * 24 * 30 * 12 * 5)
		return month.substring(0, 3) + ' ' + year;

	return year.toString();
}

function drawBottomLabels(c, list, leftEdge, rightEdge, height, len) {
	var startPoint = leftEdge - 10;
	var endPoint = rightEdge - (15 + len * 6);
	var listCount = list.length;
	if (listCount == 0) { listCount = 2; list = ['-', '-']; }
	if (listCount == 1) { listCount = 2; list = ['-', list[0]]; }
	if (listCount == 2) { listCount = 2; list = [list[0], list[1]]; }
	var spacer = (endPoint - startPoint) / (listCount - 1);
	for (var i = 0; i < listCount; i++) {
		writeText(c, list[i], startPoint + spacer * i, height - 5, "14px Arial", "black");
	}
}

function findHiLow(games) {
	var low = 0;
	var hi = 0;
	var profit = 0;
	if (games) {
		games.forEach(function (game) {
			profit += parseInt(game.profit);
			if (game.gameId && game.gameId > 0)
				profit = game.profit;
			if (profit > hi) {
				hi = profit;
			}
			if (profit < low) {
				low = profit;
			}
		});
	}
	var hiLow = { 'hi': hi, 'low': low };
	return hiLow;
}

function typicalNumberToMoney(amount, decimalFlg) {
	if (amount > 2 || amount < -2)
		amount = parseInt(amount);
	return convertNumberToMoney(amount, decimalFlg);
}

function writeText(c, text, x, y, font, color) {
	c.font = font;
	c.fillStyle = color;
	c.fillText(text, x, y);
}

function drawLine(c, x, y, x2, y2, strokeColor, lineWidth) {
	c.beginPath();
	c.strokeStyle = strokeColor;
	c.lineWidth = lineWidth;
	c.moveTo(x, y);
	c.lineTo(x2, y2);
	c.stroke();
	c.closePath();
}

function drawPtpCircle(ctx, x, y, size, circleColor) {
	drawCircle(ctx, x, y, size, 'black', 'white');
	drawCircle(ctx, x, y, size / 2, circleColor, circleColor);
}

function drawCircle(ctx, x, y, r, strokeColor, fillColor) {
	ctx.beginPath();
	ctx.fillStyle = fillColor;
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = 2;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function drawRect(c, x, y, width, height, fillColor, strokeColor, lineWidth) {
	c.beginPath();
	c.fillStyle = fillColor;
	c.rect(x, y, width, height);
	c.fill();
	if (lineWidth > 0) {
		c.strokeStyle = strokeColor;
		c.lineWidth = lineWidth;
		c.stroke();
	}
	c.closePath();
}

function getBottomLabels(ctx, type, leftEdge, rightEdge, height, games) {
	var numGames = games.length;
	if (numGames < 1)
		return;
	var list = [];
	if (type == 1) { //session
		if (numGames <= 10) {
			for (i = 1; i <= numGames; i++) {
				list.push(i.toString());
			}
		} else {
			list.push('1');
			list.push(parseInt(numGames * 2 / 5).toString());
			list.push(parseInt(numGames * 3 / 5).toString());
			list.push(parseInt(numGames * 4 / 5).toString());
			list.push(numGames.toString());
		}
	} else { // date
		var date1 = new Date();
		var date2 = new Date();
		if (games[0]) {
			date1 = new Date(games[0].startTime);
			date2 = new Date(games[numGames - 1].startTime);
		}

		var range = 10000;
		if (date1 && date2)
			range = (date2.getTime() - date1.getTime()) / 1000;
		
		if (numGames <= 5) {
			for (i = 0; i < numGames; i++) {
				var d = new Date(games[i].startTime);
				list.push(shortDateFromStartTime(d, range));
			}
		} else {
			list.push(shortDateFromStartTime(date1, range));
			var dateX2 = new Date(date1.getTime() + range * 1000 * 2 / 5);
			var dateX3 = new Date(date1.getTime() + range * 1000 * 3 / 5);
			var dateX4 = new Date(date1.getTime() + range * 1000 * 4 / 5);
			list.push(shortDateFromStartTime(dateX2, range));
			list.push(shortDateFromStartTime(dateX3, range));
			list.push(shortDateFromStartTime(dateX4, range));
			list.push(shortDateFromStartTime(date2, range));
		}
	}
	var lastItem = list[list.length - 1];
	drawBottomLabels(ctx, list, leftEdge, rightEdge, height, lastItem.length);
}


















function drawPieChart(games, allGames, type, year, pieChartType) {
	if (allGames) {
		generatePieChartObj(games, allGames, type, year, pieChartType);
	}
}
function generatePieChartObj(games, allGames, type, year, pieChartType) {
	var statHash = {};
	var graphTypes = ['type', 'gameType', 'limitType', 'stakes', 'location'];
	games.forEach(function (game) {
		var keyVal = game[graphTypes[pieChartType]];
		var p = numberVal(statHash[keyVal]);
		p++;
		//		p+=numberVal(game.profit);
		if (keyVal)
			statHash[keyVal] = p;
	});
	var k = Object.keys(statHash);
	var barList = [];
	for (var i = 0; i < k.length; i++) {
		var keyVal = k[i];
		var amount = statHash[keyVal];
		if (keyVal.length > 0)
			barList.push(objOfName(keyVal, amount));
	}
	drawPieChartForObjs(barList, 'pieChartsCanvas');
}
function drawPieChartForObjs(barList, id) {
	var c = document.getElementById(id);
	if (c) {
		c.width = 640;
		c.height = 240;
		var leftEdge = 50;
		var rightEdge = 640;
		c.style.width = '100%';
		c.style.height = '240px';
		var ctx = c.getContext("2d");

		var hiLow = findBarHiLow(barList);
		drawThePie(ctx, barList, c);

	}
}
function drawThePie(ctx, barList, c) {
	var centerX = c.width / 2;
	var centerY = c.height / 2;
	var radius = c.height / 2 - 10;
	var startDegrees = 0;
	var total = 0;
	for (var i = 0; i < barList.length; i++) {
		total += numberVal(barList[i].value);
	}
	var colors = ['green', 'red', 'blue', 'purple', 'orange', 'gray', 'magenta', 'black', 'cyan', 'gold', 'pink'];
	var colorCount = 0;
	if (total > 0) {

		for (var i = 0; i < barList.length; i++) {
			var value = numberVal(barList[i].value);
			if (value / total > .05) {
				endDegrees = startDegrees + value * 360 / total;
				var pieColor = colors[colorCount++ % 10];
				drawPtpPieSlice(ctx, centerX, centerY, radius, startDegrees, endDegrees, pieColor, barList[i].name);
				startDegrees = endDegrees;
			}
		}
		if (startDegrees < 360)
			drawPtpPieSlice(ctx, centerX, centerY, radius, startDegrees, 360, colors[colorCount % 10], 'Other');

	}
}
function drawPtpPieSlice(ctx, centerX, centerY, radius, startDegrees, endDegrees, pieColor, name) {
	if (endDegrees - startDegrees == 360) {
		//		drawPieSlice(ctx, centerX, centerY, radius, degreesToAngle(startDegrees), degreesToAngle(endDegrees), pieColor);
		drawCircle(ctx, centerX, centerY, radius, 'black', pieColor);
		writeText(ctx, name, centerX - (name.length * 4), centerY, "14px Arial", 'white');
	} else {
		drawPieSlice(ctx, centerX, centerY, radius, degreesToAngle(startDegrees), degreesToAngle(endDegrees), pieColor);
		var midPoint = (endDegrees + startDegrees) / 2;
		var cos = Math.cos(degreesToAngle(midPoint));
		var sin = Math.sin(degreesToAngle(midPoint));
		var distance = radius * 3 / 5;
		var textX = centerX + distance * cos - (name.length * 4);
		var textY = centerY + distance * sin;
		writeText(ctx, name, textX, textY, "14px Arial", 'white');
	}

}


function degreesToAngle(degrees) {
	return Math.PI * degrees / 180;
}

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle) {
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.stroke();
}
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
	ctx.fillStyle = color;
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawBarCharts(games, allGames, type, year, profitType) {
	if (allGames) {
		drawYearBarCharts(allGames, allGames, type, year, profitType);
		drawMonthBarCharts(games, allGames, type, year, profitType);
		drawDayBarCharts(games, allGames, type, year, profitType);
		drawDayTimeBarCharts(games, allGames, type, year, profitType);
	}
}
function drawGoalsChart(games, allGames, type, year, profitType) {
	if (allGames) {
		drawGoalsChartMain(games, allGames, type, year, profitType);
	}
}
function drawGoalsChartMain(games, allGames, type, year, profitType) {
	var monthKeys = {};
	var minutesKeys = {};
	games.forEach(function (game) {
		var keyVal = game.month;
		var p = numberVal(monthKeys[keyVal]);
		p += numberVal(game.profit);
		monthKeys[keyVal] = p;

		var m = numberVal(minutesKeys[keyVal]);
		m += numberVal(game.minutes);
		minutesKeys[keyVal] = m;
	});
	barList = [];
	var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	for (var i = 0; i < mlist.length; i++) {
		var keyVal = mlist[i];
		var amount = monthKeys[keyVal];
		var minutes = minutesKeys[keyVal];
		if (profitType == 1 && minutes > 0)
			amount = amount * 60 / minutes;
		barList.push(objOfName(keyVal, amount));
	}
	var goalAmount = (profitType == 0) ? localStorage.profitGoalField : localStorage.hourlyProfitGoal;
	drawBarChartForObjs(barList, "goalsCanvas", moneyToNumber(goalAmount));

}
function drawYearBarCharts(games, allGames, type, year, profitType) {
	var monthKeys = {};
	var minutesKeys = {};
	var minYear = 9999;
	var maxYear = 0;
	games.forEach(function (game) {
		var keyVal = game.year;
		var year = parseInt(keyVal);
		if (year < minYear)
			minYear = year;
		if (year > maxYear)
			maxYear = year;
		if (type == 0 || (type == 1 && game.type == 'Cash') || (type == 2 && game.type == 'Tournament')) {
			var p = numberVal(monthKeys[keyVal]);
			p += numberVal(game.profit);
			monthKeys[keyVal] = p;

			var m = numberVal(minutesKeys[keyVal]);
			m += numberVal(game.minutes);
			minutesKeys[keyVal] = m;
		}
	});
	barList = [];
	if (minYear < 9999) {
		for (var i = minYear; i <= maxYear; i++) {
			var keyVal = i.toString();
			var amount = monthKeys[keyVal];
			var minutes = minutesKeys[keyVal];
			if (profitType == 1 && minutes > 0)
				amount = amount * 60 / minutes;
			barList.push(objOfName(keyVal, amount));
		}
	}
	drawBarChartForObjs(barList, "yearCanvas")
}
function drawDayTimeBarCharts(games, allGames, type, year, profitType) {
	var monthKeys = {};
	var minutesKeys = {};
	games.forEach(function (game) {
		var keyVal = game.daytime;
		var p = numberVal(monthKeys[keyVal]);
		p += numberVal(game.profit);
		monthKeys[keyVal] = p;

		var m = numberVal(minutesKeys[keyVal]);
		m += numberVal(game.minutes);
		minutesKeys[keyVal] = m;
	});
	barList = [];
	var mlist = ["Morning", "Afternoon", "Evening", "Night"];
	for (var i = 0; i < mlist.length; i++) {
		var keyVal = mlist[i];
		var amount = monthKeys[keyVal];
		var minutes = minutesKeys[keyVal];
		if (profitType == 1 && minutes > 0)
			amount = amount * 60 / minutes;
		barList.push(objOfName(keyVal, amount));
	}
	drawBarChartForObjs(barList, "timeCanvas")
}
function drawDayBarCharts(games, allGames, type, year, profitType) {
	var monthKeys = {};
	var minutesKeys = {};
	games.forEach(function (game) {
		var keyVal = game.weekday;
		var p = numberVal(monthKeys[keyVal]);
		p += numberVal(game.profit);
		monthKeys[keyVal] = p;

		var m = numberVal(minutesKeys[keyVal]);
		m += numberVal(game.minutes);
		minutesKeys[keyVal] = m;
	});
	barList = [];
	var mlist = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	for (var i = 0; i < mlist.length; i++) {
		var keyVal = mlist[i];
		var amount = monthKeys[keyVal];
		var minutes = minutesKeys[keyVal];
		if (profitType == 1 && minutes > 0)
			amount = amount * 60 / minutes;
		barList.push(objOfName(keyVal, amount));
	}
	drawBarChartForObjs(barList, "dayCanvas")
}
function drawMonthBarCharts(games, allGames, type, year, profitType) {
	var monthKeys = {};
	var minutesKeys = {};
	games.forEach(function (game) {
		var keyVal = game.month;
		var p = numberVal(monthKeys[keyVal]);
		p += numberVal(game.profit);
		monthKeys[keyVal] = p;

		var m = numberVal(minutesKeys[keyVal]);
		m += numberVal(game.minutes);
		minutesKeys[keyVal] = m;
	});
	barList = [];
	var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	for (var i = 0; i < mlist.length; i++) {
		var keyVal = mlist[i];
		var amount = monthKeys[keyVal];
		var minutes = minutesKeys[keyVal];
		if (profitType == 1 && minutes > 0)
			amount = amount * 60 / minutes;
		barList.push(objOfName(keyVal, amount));
	}
	drawBarChartForObjs(barList, "monthCanvas")
}
function drawBarChartForObjs(barList, id, goalAmount) {
	var c = document.getElementById(id);
	if (c) {
		c.width = 640;
		c.height = 240;
		var leftEdge = 50;
		var rightEdge = 640;
		c.style.width = '100%';
		c.style.height = '240px';
		var ctx = c.getContext("2d");

		var type = 1;
		var hiLow = findBarHiLow(barList);
		drawLeftLabels(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height);
		drawBottomBarLabels(ctx, leftEdge, rightEdge, c.height, barList);
		drawBars(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height - 20, barList);
		if (id == "goalsCanvas") {
			var goalLine = getYVal(hiLow.hi, hiLow.low, c.height - 20, goalAmount);
			drawLine(ctx, leftEdge, goalLine, rightEdge, goalLine, 'blue', 2);
		}
	}
}
function drawBars(ctx, hi, low, leftEdge, rightEdge, height, barList) {
	var zeroLine = getYVal(hi, low, height, 0);
	var spacer = barChartSpacer(leftEdge, rightEdge, barList);
	var range = hi - low;
	leftSide = leftEdge + 70 - barList.length * 3;
	if (range == 0)
		range = 1;
	for (var i = 0; i < barList.length; i++) {
		var bar = barList[i];
		var barHeight = height * bar.value / range;
		var barColor = (bar.value >= 0) ? '#0a0' : '#d40';
		drawRect(ctx, leftSide + spacer * i - spacer / 5, zeroLine - barHeight, spacer - spacer / 10, barHeight, barColor, '#e6e15c', 0);
	}
	drawLine(ctx, leftEdge, zeroLine, rightEdge, zeroLine, 'red', 2);
}

function drawBottomBarLabels(ctx, leftEdge, rightEdge, height, barList) {
	var spacer = barChartSpacer(leftEdge, rightEdge, barList);
	leftEdge += 70 - barList.length * 3;
	for (var i = 0; i < barList.length; i++) {
		var name = barList[i].name;
		if (barList.length > 6 && name.length > 4)
			name = name.substring(0, 3);
		writeText(ctx, name, leftEdge + spacer * i, height - 5, "14px Arial", "black");
	}
}
function barChartSpacer(leftEdge, rightEdge, barList) {
	var startPoint = leftEdge + 30;
	var endPoint = rightEdge - 30;
	var listCount = barList.length;
	return (endPoint - startPoint) / (listCount);
}

function objOfName(name, value) {
	var obj = new Object();
	obj.name = name;
	obj.value = value;
	return obj;
}
function findBarHiLow(barList) {
	var low = 0;
	var hi = 0;
	barList.forEach(function (obj) {
		if (obj.value > hi) {
			hi = obj.value;
		}
		if (obj.value < low) {
			low = obj.value;
		}
	});
	var hiLow = { 'hi': hi, 'low': low };
	return hiLow;
}
function drawGraphOfFriends(games, friendItems, type) {
	if (!games)
		return;
	var c = document.getElementById("myCanvas");
	if (c) {
		c.width = 640;
		c.height = 240;
		var leftEdge = 50;
		var rightEdge = 640;
		c.style.width = '100%';
		c.style.height = '240px';
		var ctx = c.getContext("2d");

		var hiLow = findHiLow(games);
		console.log('hiLow', hiLow);
		drawLeftLabels(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height);
		var gameSpan = [];
		var date = new Date();
		var day = date.getDate();
		var today = convertDateToString(date);
		gameSpan.push({ profit: 0, startTime: dayOfMonth(1, today) });
		gameSpan.push({ profit: 0, startTime: dayOfMonth(parseInt(day * .33), today) });
		gameSpan.push({ profit: 0, startTime: dayOfMonth(parseInt(day * .66), today) });
		gameSpan.push({ profit: 0, startTime: today });
		getBottomLabels(ctx, type, leftEdge, rightEdge, c.height, gameSpan);
		for (var i = 0; i < friendItems.length; i++) {
			var friendGames = friendItems[i].last90Days.split(':');
			//var monthType = getMonthType(friendItems[i].monthStats);
			//if (monthType == netTrackerMonth()) {
				var plotGames = [];
				for (var x = 0; x < friendGames.length; x++) {
					var items = friendGames[x].split('|');
					if (items.length > 1)
						plotGames.push({ profit: items[1], startTime: items[0] });
				}
				drawGames(ctx, hiLow.hi, hiLow.low, leftEdge, rightEdge, c.height - 20, plotGames, type, i, dayOfMonth(1, today), today);
			//}
		}

	}
}
function getMonthType(line) {
	if (!line)
		return '';
	var c = line.split('|');
	return c[0];
}
function dayOfMonth(day, str) {
	var parts = str.split('/');
	parts[1] = pad(day);
	return parts.join('/');
}


function friendColorForNumber(num) {
	var colors = ['#fc0', '#0ff', '#0f0', '#00f', '#ff0', '#f0f', '#aaa'];
	return colors[num % 7];
}
function drawGames(c, hi, low, leftEdge, rightEdge, height, games, type, friendNum, spanDate1, spanDate2, graphColor) {
	var totalWidth = rightEdge - leftEdge;
	var spacer = rightEdge - leftEdge;
	var numGames = games.length;
	var date1 = new Date();
	var totalSpan = 0;
	if (!graphColor || graphColor.length == 0)
		graphColor = '#e6e15c';

	if (numGames > 1) {
		spacer = (rightEdge - leftEdge) / (numGames - 1);
		if (type == 2) {
			date1 = convertStringToDate(games[0].startTime);
			var date2 = convertStringToDate(games[numGames - 1].startTime);
			totalSpan = (date2.getTime() - date1.getTime());
		}
	}
	if (spanDate1 && spanDate2) {
		date1 = convertStringToDate(spanDate1);
		var date2 = convertStringToDate(spanDate2);
		totalSpan = (date2.getTime() - date1.getTime());
	}
	if (totalSpan == 0) {
		if (games.length == 1)
			date1 = new Date(games[0].startDate);
		totalSpan = 100;
	}


	var zeroLine = getYVal(hi, low, height, 0);
	var yVal = zeroLine;
	var xVal = leftEdge;
	var profit = 0;

	// draw lines----
	c.beginPath();
	c.strokeStyle = graphColor;
	if (spanDate1) {
		c.strokeStyle = friendColorForNumber(friendNum);
	}
	c.fillStyle = graphColor;
	c.lineWidth = 2;
	c.moveTo(xVal, yVal);
	if (numGames == 1) {
		xVal += spacer;
	}
	games.forEach(function (game) {
		profit += parseInt(game.profit);
		if (game.gameId && game.gameId > 0)
			profit = game.profit;
		yVal = getYVal(hi, low, height, profit);
		if (type == 2)
			xVal = getXValForGame(game, date1, leftEdge, totalWidth, totalSpan);
		if (xVal < 50)
			xVal = 50;
		if (games.length == 1)
			xVal = 640;
		c.lineTo(xVal, yVal);
		xVal += spacer;
	});
	c.lineTo(rightEdge, yVal);
	c.lineTo(rightEdge, height);
	c.lineTo(leftEdge, height);
	c.moveTo(leftEdge, zeroLine);
	c.stroke();
	if (!spanDate1)
		c.fill();
	c.closePath();

	// draw circles----
	profit = 0;
	xVal = leftEdge;
	yVal = zeroLine;
	var size = 8;
	if (numGames > 20)
		size = 4;
	if (numGames == 1) {
		drawPtpCircle(c, xVal, yVal, size, 'black');
		xVal += spacer;
	}
	games.forEach(function (game) {
		var gameProfit = parseFloat(game.profit);
		profit += gameProfit;
		if (game.gameId && game.gameId > 0)
			profit = game.profit;
		yVal = getYVal(hi, low, height, profit);
		if (type == 2)
			xVal = getXValForGame(game, date1, leftEdge, totalWidth, totalSpan);

		drawPtpCircle(c, xVal, yVal, size, (gameProfit >= 0) ? 'green' : 'red');
		xVal += spacer;
	});


	drawLine(c, leftEdge, zeroLine, rightEdge, zeroLine, 'red', 2);
}

function getXValForGame(game, date1, leftEdge, totalWidth, totalSpan) {
	var date2 = convertStringToDate(game.startTime);
	var thisSpan = (date2.getTime() - date1.getTime());
	if (thisSpan < 0)
		thisSpan = totalSpan;
	return leftEdge + totalWidth * thisSpan / totalSpan;
}


function getYVal(hi, low, height, value) {
	var range = hi - low;
	if (range == 0)
		return height;
	var adjustedValue = value - low;
	var heightPercentage = adjustedValue / range;
	return height - (height * heightPercentage);
}

