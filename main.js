'use strict'

$(document).ready(init);

var isPlaying = false;
var gameDeck = [];
var shuffledDeck;
var $playerScore;
var $dealerScore;
var $displayDealerScore;
var playerAceCount = 0;
var dealerAceCount = 0;
var dealerHiddenCard;

function init() {
  checkPlaying();
  makeDeck();
  $('#playBtn').click(startGame);
  $('#hitBtn').click(addPlayerCard);
  $('#stayBtn').click(dealerPlay);
}

function checkPlaying() {
  if (isPlaying === true) {
    $('#hitBtn').show();
    $('#stayBtn').show();
    $('#playBtn').hide();
  }
}

function makeDeck() {
  var cardName = ['ace-of-clubs', '2-of-clubs', '3-of-clubs', '4-of-clubs', '5-of-clubs', '6-of-clubs', '7-of-clubs', '8-of-clubs', '9-of-clubs', '10-of-clubs', 'jack-of-clubs', 'queen-of-clubs', 'king-of-clubs', 'ace-of-diamonds', '2-of-diamonds', '3-of-diamonds', '4-of-diamonds', '5-of-diamonds', '6-of-diamonds', '7-of-diamonds', '8-of-diamonds', '9-of-diamonds', '10-of-diamonds', 'jack-of-diamonds', 'queen-of-diamonds', 'king-of-diamonds', 'ace-of-hearts', '2-of-hearts', '3-of-hearts', '4-of-hearts', '5-of-hearts', '6-of-hearts', '7-of-hearts', '8-of-hearts', '9-of-hearts', '10-of-hearts', 'jack-of-hearts', 'queen-of-hearts', 'king-of-hearts', 'ace-of-spades', '2-of-spades', '3-of-spades', '4-of-spades', '5-of-spades', '6-of-spades', '7-of-spades', '8-of-spades', '9-of-spades', '10-of-spades', 'jack-of-spades', 'queen-of-spades', 'king-of-spades'];
  var cardValue = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var cardImg = [];
  for (var i = 0; i < cardName.length; i++) {
    cardImg.push(new Image().src='cards/'+cardName[i]+'.jpg');
  }
  var cardBack = new Image().src='cards/card-back.jpg';
   while (cardName.length) {
    var card = {};
    card.name = cardName.shift();
    card.value = cardValue.shift();
    card.image = cardImg.shift();
    card.back = cardBack;
    gameDeck.push(card);
  }
}

function startGame() {
  isPlaying = true;
  checkPlaying();
  shuffleCards();
  dealCards();
}

function shuffleCards() {
  shuffledDeck = _.shuffle(gameDeck);
}

function dealCards() {
  var playerCard1 = shuffledDeck.shift();
  var dealerCard1 = shuffledDeck.shift();
  var playerCard2 = shuffledDeck.shift();
  var dealerCard2 = shuffledDeck.shift();

  var $playerCard1 = $('<img>').attr('src', playerCard1.image).addClass('card');
  $('#playerCards').append($playerCard1);
  if (playerCard1.value === 11) {
    playerAceCount++;
  }
  var $playerCard2 = $('<img>').attr('src', playerCard2.image).addClass('card');
  $('#playerCards').append($playerCard2);
  if (playerCard2.value === 11) {
    playerAceCount++;
  }
  $playerScore = parseInt($('#playerScore').text()) + playerCard1.value + playerCard2.value;
  $('#playerScore').text($playerScore);
  if ($playerScore === 21) {
    swal({   title: "BLACKJACK!!! YOU WIN!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
    $('#dealerCards').children().first().attr('src', dealerHiddenCard);
    $('#dealerScore').text($dealerScore);
      window.location.reload();
      swal.close();
    });
  }

  var $dealerCard1 = $('<img>').attr('src', dealerCard1.image).addClass('card');
  $('#dealerCards').append($dealerCard1);
  if (dealerCard1.value === 11) {
    dealerAceCount++;
  }
  var $dealerCard2 = $('<img>').attr('src', dealerCard2.back).addClass('card');
  $('#dealerCards').prepend($dealerCard2);
  dealerHiddenCard = dealerCard2.image;
  if (dealerCard2.value === 11) {
    dealerAceCount++;
  }
  $displayDealerScore = parseInt($('#dealerScore').text()) + dealerCard1.value;
  $dealerScore = $displayDealerScore + dealerCard2.value;
  $('#dealerScore').text($displayDealerScore);
}

function addPlayerCard() {
  var newCard = shuffledDeck.shift();
  var $newCard = $('<img>').attr('src', newCard.image).addClass('card');
  $('#playerCards').append($newCard);
  if (newCard.value === 11) {
    playerAceCount++;
  }
  $playerScore = parseInt($('#playerScore').text()) + newCard.value;
  checkPlayerBust();
  $('#playerScore').text($playerScore);
}

function checkPlayerBust() {
  if ($playerScore > 21 && playerAceCount > 0) {
    $playerScore -= 10;
    playerAceCount--;
  } else if ($playerScore > 21) {
    swal({   title: "BUSTED!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
      $('#dealerCards').children().first().attr('src', dealerHiddenCard);
      $('#dealerScore').text($dealerScore);
      window.location.reload();
      swal.close();
    });
  }
}

function dealerPlay() {
  while ($dealerScore < 16) {
    addDealerCard();
  }
  checkDealerBust();
  $('#dealerCards').children().first().attr('src', dealerHiddenCard);
  $('#dealerScore').text($dealerScore);
  checkWin();
}

function addDealerCard() {
  var newCard = shuffledDeck.shift();
  var $newCard = $('<img>').attr('src', newCard.image).addClass('card');
  $('#dealerCards').append($newCard);
  if (newCard.value === 11) {
    dealerAceCount++;
  }
  $dealerScore = $dealerScore + newCard.value;
  $displayDealerScore = parseInt($('#dealerScore').text()) + newCard.value;
  $('#dealerScore').text($displayDealerScore);
  checkDealerBust();
  dealerPlay();
}

function checkDealerBust() {
  if ($dealerScore > 21 && dealerAceCount > 0) {
    $dealerScore -= 10;
    dealerAceCount--;
  } else if ($dealerScore > 21) {
    swal({   title: "DEALER BUSTS!!! YOU WIN!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
      $('#dealerCards').children().first().attr('src', dealerHiddenCard);
      $('#dealerScore').text($dealerScore);
      window.location.reload();
      swal.close();
    });
  }
}

function checkWin() {
  if ($playerScore > $dealerScore) {
    swal({   title: "YOU WIN!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
      window.location.reload();
      swal.close();
    })
  } else if ($dealerScore > $playerScore && $dealerScore <= 21){
    swal({   title: "DEALER WINS!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
      window.location.reload();
      swal.close();
    })
  } else if ($playerScore === $dealerScore) {
    swal({   title: "TIE!!!",
      closeOnConfirm: false,
      animation: "slide-from-top"
    },
    function(){
      window.location.reload();
      swal.close();
    })
  }
}