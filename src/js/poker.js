function randomCard(hash) {
  var found = false;
  var x = 0
  while (!found) {
    var card = Math.floor((Math.random() * 13));
    var suit = Math.floor((Math.random() * 4));
    var cardStr = cardOfNumber(card) + suitOfNumber(suit);
    if (!hash[cardStr])
      found = true;

    if (x++ >= 100) {
      console.log('ran out of cards!')
      found = true;
    }
      
  }
  hash[cardStr] = true;
  return cardStr;
}
function cardOfNumber(num) {
  if (num == 0)
    return 'K';
  if (num == 1)
    return 'A';
  if (num == 10)
    return 'T';
  if (num == 11)
    return 'J';
  if (num == 12)
    return 'Q';
  return num.toString();
}
function suitOfNumber(num) {
  if (num == 0)
    return 'c';
  if (num == 1)
    return 'd';
  if (num == 2)
    return 'h';

  return 's';
}
//----------------------------
/*
function populatePokerRows(rows, num) {
  closePopup('popupOdds');
  rows.push({ name: 'Your Hand', value: '-select-', card: '', numCards: 2, id: 'yourHandField' });
  for (var x = 1; x < num; x++) {
    var name = 'Player ' + (x + 1).toString();
    rows.push({ name: name + ' Hand', value: '-select-', card: '', numCards: 2, id: name + 'Field' });
  }

  rows.push({ name: 'Flop', value: '-select-', card: '', numCards: 3, id: 'flopField' });
  rows.push({ name: 'Turn', value: '-select-', card: '', numCards: 1, id: 'turnField' });
  rows.push({ name: 'River', value: '-select-', card: '', numCards: 1, id: 'riverField' });
}
function clearHandButtonPressed(rows) {
  disableButton("clearButton", true);
  disableButton("randomButton", false);
  disableButton("calculateButton", false);
  rows.forEach(function (line) {
    line.value = '-select-';
    line.card = '';
    line.card1 = '';
    line.card2 = '';
    line.card3 = '';
  });
}*/
function handName(num) {
  var value = parseInt(num / 1000000);
  var names = ['Junk', 'Junk', 'Pair', '2-Pair', 'Trips', 'Straight', 'Flush', 'Full House', 'Quads', 'Straight Flush', 'Wild', 'Wild'];
  return names[value];
}
function getHandValue(allCards) {
  var handStrength = 0;
  var cards = allCards.split(' ');
  var suitHash = {};
  var cardValHash = {};
  var maxSuit = '';
  var maxSuitCount = 0;
  var highestQuad = 0;
  var highestTrip = 0;
  var secondTrip = 0;
  var highestPair = 0;
  var secondPair = 0;
  var highestJunk = 0;
  var secondJunk = 0;
  var thirdJunk = 0;
  var fourthJunk = 0;
  var fifthJunk = 0;
  for (var x = 0; x < cards.length; x++) {
    var suit = cards[x].substring(1, 2);
    var val = convertCardVal(cards[x].substring(0, 1));
    if (cardValHash[val])
      cardValHash[val]++;
    else
      cardValHash[val] = 1;

    if (suitHash[suit])
      suitHash[suit]++;
    else
      suitHash[suit] = 1;
    if (suitHash[suit] > maxSuitCount) {
      maxSuitCount = suitHash[suit];
      maxSuit = suit;
    }
  }
  //straight flush
  if (maxSuitCount >= 5) {
    handStrength = checkForStraightFlush(cards, maxSuit);
    if (handStrength > 0)
      return handStrength;
  }
  var numberkeys = Object.keys(cardValHash);
  for (var x = 0; x < numberkeys.length; x++) {
    var val = numberkeys[x];
    var cardValNum = numberVal(cardValHash[val]);
    var cardVal = numberVal(val);
    if (cardValNum >= 4)
      highestQuad = cardVal;
    if (cardValNum == 3) {
      if (cardVal > highestTrip) {
        secondTrip = highestTrip;
        highestTrip = cardVal;
      } else if (cardVal > secondTrip)
        secondTrip = cardVal;
    }
    if (cardValNum == 2) {
      if (cardVal > highestPair) {
        secondPair = highestPair;
        highestPair = cardVal;
      } else if (cardVal > secondPair)
        secondPair = cardVal;
    }
    if (cardValNum == 1) {
      if (cardVal > highestJunk) {
        fifthJunk = fourthJunk;
        fourthJunk = thirdJunk;
        thirdJunk = secondJunk;
        secondJunk = highestJunk;
        highestJunk = cardVal;
      } else if (cardVal > secondJunk) {
        fifthJunk = fourthJunk;
        fourthJunk = thirdJunk;
        thirdJunk = secondJunk;
        secondJunk = cardVal;
      } else if (cardVal > thirdJunk) {
        fifthJunk = fourthJunk;
        fourthJunk = thirdJunk;
        thirdJunk = cardVal;
      } else if (cardVal > fourthJunk) {
        fifthJunk = fourthJunk;
        fourthJunk = cardVal;
      } else
        fifthJunk = cardVal;
    }
  }
  //----quads
  if (highestQuad > 0) {
    if (highestTrip > highestJunk)
      highestJunk = highestTrip;
    if (highestTrip > highestPair)
      highestPair = highestTrip;
    return 8000000 + highestQuad * 15 + highestJunk;
  }
  //----full house
  if (highestTrip > 0 && (secondTrip > 0 || highestPair > 0)) {
    if (secondTrip > highestPair)
      highestPair = secondTrip;
    return 7000000 + highestTrip * 15 + highestPair;
  }
  //---flush
  if (maxSuitCount >= 5)
    return calculateFlushValue(cards, maxSuit);
  //---straight
  handStrength = checkForStraight(cards);
  if (handStrength > 0)
    return handStrength;
  //---trips
  if (highestTrip > 0)
    return 4000000 + highestTrip * 225 + highestJunk * 15 + secondJunk;
  //---2pair
  if (secondPair > 0)
    return 3000000 + highestPair * 225 + secondPair * 15 + highestJunk;
  //---1pair
  if (highestPair > 0)
    return 2000000 + highestPair * 3375 + highestJunk * 225 + secondJunk * 15 + thirdJunk;
  //---junk
  return highestJunk * 50625 + secondJunk * 3375 + thirdJunk * 225 + fourthJunk * 15 + fifthJunk;
}
function convertCardVal(card) {
  if (card == 'A')
    return '14';
  if (card == 'K')
    return '13';
  if (card == 'Q')
    return '12';
  if (card == 'J')
    return '11';
  if (card == 'T')
    return '10';
  return card;
}
function calculateFlushValue(cards, suit) {
  var cardList = [];
  for (var x = 0; x < cards.length; x++) {
    var card = cards[x];
    if (card.indexOf(suit) !== -1)
      cardList.push(convertCardVal(card.substring(0, 1)));
  }
  cardList.sort(function (a, b) { return b - a });
  var val = 6000000 + numberVal(cardList[0]) * 50625 + numberVal(cardList[1]) * 3375 + numberVal(cardList[2]) * 225 + numberVal(cardList[3]) * 15 + numberVal(cardList[4]);
  return val;
}
function checkForStraight(cards) {
  var cardHash = {}
  for (var x = 0; x < cards.length; x++) {
    var card = cards[x];
    cardHash[convertCardVal(card.substring(0, 1))] = 1;
  }
  for (var y = 14; y >= 6; y--) {
    if (cardHash[y] == 1 && cardHash[y - 1] == 1 && cardHash[y - 2] == 1 && cardHash[y - 3] == 1 && cardHash[y - 4] == 1) {
      return 5000000 + y;
    }
  }
  if (cardHash['5'] == 1 && cardHash['4'] == 1 && cardHash['3'] == 1 && cardHash['2'] == 1 && cardHash['14'] == 1) {
    return 5000000;
  }
  return 0;
}
function checkForStraightFlush(cards, suit) {
  var cardHash = {}
  for (var x = 0; x < cards.length; x++) {
    var card = cards[x];
    if (card.indexOf(suit) !== -1)
      cardHash[convertCardVal(card.substring(0, 1))] = 1;
  }
  for (var y = 14; y >= 6; y--) {
    if (cardHash[y] == 1 && cardHash[y - 1] == 1 && cardHash[y - 2] == 1 && cardHash[y - 3] == 1 && cardHash[y - 4] == 1) {
      return 8000000 + y;
    }
  }
  if (cardHash['5'] == 1 && cardHash['4'] == 1 && cardHash['3'] == 1 && cardHash['2'] == 1 && cardHash['14'] == 1) {
    return 8000000;
  }
  return 0;
}
/*function randomCardNotInHere(cards) {
  var check = 1;
  var card = '';
  var count = 0;
  while (check == 1) {
    var val = Math.floor((Math.random() * 13) + 2);
    var suit = Math.floor((Math.random() * 4) + 1);
    card = cardFaceOfNumber(val) + suitOfNumber(suit);
    check = 0;
    if (cards.indexOf(card) !== -1)
      check = 1;
    if (count++ == 200) {
      console.log('whoa');
      check = 0;
    }
  }
  return card;
}
function cardFaceOfNumber(num) {
  if (num == 10)
    return 'T';
  if (num == 11)
    return 'J';
  if (num == 12)
    return 'Q';
  if (num == 13)
    return 'K';
  if (num == 14)
    return 'A';
  return num.toString();
}
function suitOfNumber(number) {
  var type = 's';
  if (number == 2)
    type = 'c';
  if (number == 3)
    type = 'h';
  if (number == 4)
    type = 'd';
  return type;
}
function suitOfType(type) {
  if (type == 's')
    return '\u2660'; //&#x2660;
  if (type == 'c')
    return '\u2663';
  if (type == 'h')
    return '\u2665';
  if (type == 'd')
    return '\u2666';
  return '?';
}
function colorOfSuit(card) {
  if (!card)
    return 'black';
  var color = 'black';
  if (card.indexOf('\u2660') !== -1)
    color = 'black'; //spade
  if (card.indexOf('\u2663') !== -1)
    color = 'green'; //club
  if (card.indexOf('\u2665') !== -1)
    color = 'red'; //heart
  if (card.indexOf('\u2666') !== -1)
    color = 'blue'; //spade
  return color;
}
function translateToIcons(line) {
  if (line) {
    line = line.replace(/s/g, '\u2660');
    line = line.replace(/c/g, '\u2663');
    line = line.replace(/h/g, '\u2665');
    line = line.replace(/d/g, '\u2666');
  }
  return line;
}
function translateToLetters(line) {
  if (line) {
    line = line.replace(/\u2660/g, 's');
    line = line.replace(/\u2663/g, 'c');
    line = line.replace(/\u2665/g, 'h');
    line = line.replace(/\u2666/g, 'd');
  }
  return line;
}

function populateCardObjWithCard(card) {
  var obj = {};
  if (card) {
    card = translateToLetters(card);
    obj.suit = card.substring(1, 2);
    obj.val = card.substring(0, 1);
  }
  return obj;
}
function disableSuits(flag) {
  document.getElementById("spade").disabled = flag;
  document.getElementById("club").disabled = flag;
  document.getElementById("heart").disabled = flag;
  document.getElementById("diamond").disabled = flag;
}
function disableCards(flag) {
  document.getElementById("card2").disabled = flag;
  document.getElementById("card3").disabled = flag;
  document.getElementById("card4").disabled = flag;
  document.getElementById("card5").disabled = flag;
  document.getElementById("card6").disabled = flag;
  document.getElementById("card7").disabled = flag;
  document.getElementById("card8").disabled = flag;
  document.getElementById("card9").disabled = flag;
  document.getElementById("cardT").disabled = flag;
  document.getElementById("cardJ").disabled = flag;
  document.getElementById("cardQ").disabled = flag;
  document.getElementById("cardK").disabled = flag;
  document.getElementById("cardA").disabled = flag;
}
function displayCards(cards) {
  displayCard('card1Display', cards[0]);
  displayCard('card2Display', cards[1]);
  displayCard('card3Display', cards[2]);
}
function displayCard(id, obj) {
  setInnerHTMLFromElement(id, cardStringToIcon(obj));
}
function cardStringToIcon(obj) {
  if (obj.val == '-') {
    obj = {};
  }
  var suit = obj.suit || '?';
  suit = suitOfType(suit);
  var val = obj.val || '?';
  if (suit == '?' && val == '?')
    return '?';
  else {
    return val + suit;
  }
}
function cardObjOfCard(obj, card) {
  obj.suit = card.substring(1, 2);
  obj.val = card.substring(0, 1);
}
function selectPokerCard(num) {
  disableSuits(false);
  disableCards(true);
  disableButton('randomCardButton', false);
  return num;
}
function randomCardsForLine(line, cardHash) {
  var card1 = randomCard(cardHash);
  cardHash[card1] = 1;
  var card2 = randomCard(cardHash);
  cardHash[card2] = 1;
  var card3 = randomCard(cardHash);
  if (line.numCards == 1)
    return card1;
  if (line.numCards == 2)
    return card1 + ' ' + card2;
  if (line.numCards == 3)
    return card1 + ' ' + card2 + ' ' + card3;
}
function randomCard(cardHash) {
  var check = 1;
  var card = '';
  var count = 0;
  while (check == 1) {
    var val = Math.floor((Math.random() * 13) + 2);
    var suit = Math.floor((Math.random() * 4) + 1);
    card = cardFaceOfNumber(val) + suitOfNumber(suit);
    check = cardHash[card];
    if (count++ == 200) {
      console.log('whoa');
      check = 0;
    }
  }
  return card;
}
function checkThisConflict(card, conflictFlg, cardHash) {
  if (conflictFlg)
    return true;
  if (card) {
    var cardName = card.val + card.suit;
    if (cardHash[cardName] == 1) {
      return true;
    }
  }
  return false;
}
function checkForConflicts(cards, cardHash) {
  var conflictFlg = false;
  conflictFlg = checkThisConflict(cards[0], conflictFlg, cardHash);
  conflictFlg = checkThisConflict(cards[1], conflictFlg, cardHash);
  conflictFlg = checkThisConflict(cards[2], conflictFlg, cardHash);
  return conflictFlg;
}
function populateUsedCardHash(rows) {
  cardHash = {};
  rows.forEach(function (line) {
    if (line.value && line.value != '-select-') {
      var components = translateToLetters(line.value).split(' ');
      for (var x = 0; x < components.length; x++) {
        cardHash[components[x]] = 1;
      }
    }
  });
  return cardHash;
}
function pokerFinalSelectPressed(selectedItem, pokerCards) {
  selectedItem.card1 = cardStringToIcon(pokerCards[0]);
  if (selectedItem.numCards == 1) {
    selectedItem.value = cardStringToIcon(pokerCards[0]);
  }
  if (selectedItem.numCards == 2) {
    selectedItem.card2 = cardStringToIcon(pokerCards[1]);
    selectedItem.value = cardStringToIcon(pokerCards[0]) + ' ' + cardStringToIcon(pokerCards[1]);
  }
  if (selectedItem.numCards == 3) {
    selectedItem.card2 = cardStringToIcon(pokerCards[1]);
    selectedItem.card3 = cardStringToIcon(pokerCards[2]);
    selectedItem.value = cardStringToIcon(pokerCards[0]) + ' ' + cardStringToIcon(pokerCards[1]) + ' ' + cardStringToIcon(pokerCards[2]);
  }
  selectedItem.card = translateToLetters(selectedItem.value);
  disableButton('clearButton', false);
  disableButton('randomButton', false);
  disableButton('calculateButton', false);
}
function pokerSelectSuit(pokerCards, usedCardHash, suit) {
  disableSuits(true);
  disableCards(false);
  for (var x = 2; x <= 14; x++) {
    var val = cardFaceOfNumber(x);
    var card = val + suit;
    disableButton('card' + val, (usedCardHash[card] == 1))
  }
  document.getElementById("cardSelectButton").disabled = true;
  displayCards(pokerCards);
}
function pokerSelectCardVal(pokerCards, usedCardHash) {
  var conflictFlg = checkForConflicts(pokerCards, usedCardHash);
  if (!conflictFlg)
    document.getElementById("cardSelectButton").disabled = false;
  displayCards(pokerCards);
  return conflictFlg;
}
function closePopupPickCards() {
  closePopup('popupPickCards');
  return 3;
}
function fillWithRandomCards(pokerRows, cardHash) {
  cardHash = populateUsedCardHash(pokerRows);
  disableButton("randomButton", true);
  disableButton("clearButton", false);
  pokerRows.forEach(function (line) {
    if (line.value && (line.value.length == 0 || line.value == '-select-' || line.value.indexOf('?') !== -1)) {
      line.card = randomCardsForLine(line, cardHash);
      line.value = translateToIcons(line.card);
      var cards = line.value.split(' ');
      line.card1 = cards[0];
      line.card2 = cards[1];
      line.card3 = cards[2];
    }
    cardHash = populateUsedCardHash(pokerRows);
  });
}
function pokerClaculateFinal(num, pokerRows, oddsDetails) {
  var numPlayers = parseInt(num);
  var flop = pokerRows[numPlayers].card;
  var turn = pokerRows[numPlayers + 1].card;
  var river = pokerRows[numPlayers + 2].card;
  var bestHand = 0;
  for (var x = 0; x < numPlayers; x++) {
    var hand = pokerRows[x].card;
    var handStrength = getHandValue(flop + ' ' + turn + ' ' + river + ' ' + hand);
    if (handStrength > bestHand)
      bestHand = handStrength;
  }
  for (var x = 0; x < numPlayers; x++) {
    var hand = pokerRows[x].card;
    var handStrength = getHandValue(flop + ' ' + turn + ' ' + river + ' ' + hand);
    var result = (handStrength == bestHand) ? 'Win' : 'Loss';
    oddsDetails[3].results[x].value = result + ' (' + handName(handStrength) + ')';
  }
  oddsDetails[3].status = 'Done';
}
function pokerClaculateTurn(num, pokerRows, oddsDetails) {
  var numPlayers = parseInt(num);
  var flop = pokerRows[numPlayers].card;
  var turn = pokerRows[numPlayers + 1].card;
  var river = pokerRows[numPlayers + 2].card;
  var totalHands = 0;
  var winHash = {};
  for (var x = 0; x < numPlayers; x++) {
    winHash[x] = 0;
  }
  for (var i = 0; i < 1000; i++) {
    var bestHand = 0;
    totalHands++;
    var riverCard = randomCardNotInHere(flop + ' ' + turn + ' ' + hand);
    if (i <= 1)
      riverCard = river;
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flop + ' ' + turn + ' ' + riverCard + ' ' + hand);
      if (handStrength > bestHand)
        bestHand = handStrength;
    }
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flop + ' ' + turn + ' ' + riverCard + ' ' + hand);
      if (handStrength == bestHand) {
        winHash[x]++;
      }
    }
  }
  for (var x = 0; x < numPlayers; x++) {
    var winPercentage = parseInt(winHash[x] * 100 / totalHands);
    oddsDetails[2].results[x].value = winPercentage + '%';
  }
  oddsDetails[2].status = 'Done';
}
function pokerClaculatePostflop(num, pokerRows, oddsDetails) {
  var numPlayers = parseInt(num);
  var flop = pokerRows[numPlayers].card;
  var turn = pokerRows[numPlayers + 1].card;
  var river = pokerRows[numPlayers + 2].card;
  var totalHands = 0;
  var winHash = {};
  for (var x = 0; x < numPlayers; x++) {
    winHash[x] = 0;
  }
  for (var i = 0; i < 1000; i++) {
    var bestHand = 0;
    totalHands++;
    var turnCard = randomCardNotInHere(flop + ' ' + hand);
    var riverCard = randomCardNotInHere(flop + ' ' + turnCard + ' ' + hand);
    if (i <= 10) {
      riverCard = river;
      turnCard = turn;
    }
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flop + ' ' + turnCard + ' ' + riverCard + ' ' + hand);
      if (handStrength > bestHand)
        bestHand = handStrength;
    }
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flop + ' ' + turnCard + ' ' + riverCard + ' ' + hand);
      if (handStrength == bestHand) {
        winHash[x]++;
      }
    }
  }
  for (var x = 0; x < numPlayers; x++) {
    var winPercentage = parseInt(winHash[x] * 100 / totalHands);
    oddsDetails[1].results[x].value = winPercentage + '%';
  }
  oddsDetails[1].status = 'Done';
}
function pokerClaculatePreflop(num, pokerRows, oddsDetails) {
  var numPlayers = parseInt(num);
  var flop = pokerRows[numPlayers].card;
  var turn = pokerRows[numPlayers + 1].card;
  var river = pokerRows[numPlayers + 2].card;
  var totalHands = 0;
  var winHash = {};
  for (var x = 0; x < numPlayers; x++) {
    winHash[x] = 0;
  }
  for (var i = 0; i < 2000; i++) {
    var bestHand = 0;
    totalHands++;
    var turnCard = randomCardNotInHere(flop + ' ' + hand);
    var riverCard = randomCardNotInHere(flop + ' ' + turnCard + ' ' + hand);
    var usedCards = flop + ' ' + turnCard + ' ' + hand + ' ' + riverCard;
    var flopCards = randomCardNotInHere(usedCards) + ' ' + randomCardNotInHere(usedCards) + ' ' + randomCardNotInHere(usedCards);
    if (i <= 10) {
      riverCard = river;
      turnCard = turn;
      flopCards = flop;
    }
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flopCards + ' ' + turnCard + ' ' + riverCard + ' ' + hand);
      if (handStrength > bestHand)
        bestHand = handStrength;
    }
    for (var x = 0; x < numPlayers; x++) {
      var hand = pokerRows[x].card;
      var handStrength = getHandValue(flopCards + ' ' + turnCard + ' ' + riverCard + ' ' + hand);
      if (handStrength == bestHand) {
        winHash[x]++;
      }
    }
  }
  for (var x = 0; x < numPlayers; x++) {
    var winPercentage = parseInt(winHash[x] * 100 / totalHands);
    oddsDetails[0].results[x].value = winPercentage + '%';
  }
  oddsDetails[0].status = 'Done';
}
function oddsDetailsInit(num) {
  var oddsDetails = [];
  oddsDetails.push({ name: 'Preflop Odds', status: 'Not Calculated' });
  oddsDetails.push({ name: 'Postflop Odds', status: 'Not Calculated' });
  oddsDetails.push({ name: 'Turn Odds', status: 'Not Calculated' });
  oddsDetails.push({ name: 'Final Result', status: 'Not Calculated' });
  var resultsArray0 = [];
  var resultsArray1 = [];
  var resultsArray2 = [];
  var resultsArray3 = [];
  resultsArray0.push({ name: 'You', value: '*' });
  resultsArray1.push({ name: 'You', value: '*' });
  resultsArray2.push({ name: 'You', value: '*' });
  resultsArray3.push({ name: 'You', value: '*' });
  for (var x = 1; x < num; x++) {
    var name = 'Player ' + (x + 1).toString();
    resultsArray0.push({ name: name, value: '*' });
    resultsArray1.push({ name: name, value: '*' });
    resultsArray2.push({ name: name, value: '*' });
    resultsArray3.push({ name: name, value: '*' });
  }
  oddsDetails[0].results = resultsArray0;
  oddsDetails[1].results = resultsArray1;
  oddsDetails[2].results = resultsArray2;
  oddsDetails[3].results = resultsArray3;
  return oddsDetails;
}*/
