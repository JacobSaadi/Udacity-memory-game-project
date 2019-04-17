'use strict';
// Get Restart button
const restartBtn= document.querySelector('.restart');
// Get deck
const deck= document.querySelector('.deck');
// Get stars
const stars= document.querySelectorAll('.star');
// Get seconds
const appendSeconds= document.querySelector('.seconds');
// Get minutes
const appendMinutes= document.querySelector('.minutes');
// Get moves
const moves= document.querySelector('.moves');
// Get help button
const helpBtn= document.querySelector('.helpButton');
// Cards List
let openCards=[];
// Create list of card symbols
let symbols = ["fa fa-diamond", "fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
// Concat the symbols and store them in an array
let cardsList = symbols.concat(symbols);
// Matched Cards
let cardsMatched;
// Number of stars
let rating;
// Number of moves
let movesNumber;
// Timer
let timer;
// Number of seconds
let seconds= 0;
// Number of minutes
let minutes= 0;
// helping me control the timer
let times;
// Restart button eventListener created
restartBtn.addEventListener("click", function() {
	stopTimer();
	restartGame();
	Swal.fire({
  position: 'center',
  type: 'success',
  title: 'Game restarted',
  showConfirmButton: false,
  timer: 1000
})
});
// Deck eventListener created
deck.addEventListener("click", function(event) {
	if(event.target.nodeName==='LI') {
		showCard(event.target);
        openedCard(event.target);
        if(times===1) {
        	startTimer();
        }
        times++;
	}
});
// help button eventListener
helpBtn.addEventListener("click", function() {
    Swal.fire({
  title: 'Matching card Game',
  text: 'Game Rules: The game board consists of sixteen cards arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!'
})
});
// Game Started
restartGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function resetCards() {
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    // Calling the shuffle function
    cardsList= shuffle(cardsList);
    // Clearing the deck 
    deck.innerHTML= "";
    // looping through the cards array and creating their HTML then adding it to the deck
    cardsList.forEach(function(card) {
	    card=`<li class="card">
                    <i class="fa ${card}"></i>
                </li>`;
        deck.innerHTML+= card;
    });
}
// The showCard function which adds the classes (open/show/disabled) to the element
function showCard(card) {
	card.classList.add("open");
	card.classList.add("show");
	card.classList.add("disabled");
}
// The openedCard function which pushes the previous element to openCards array
function openedCard(card) {
	openCards.push(card);
	if(openCards.length > 1) {
	    checkMatch();
	}
}
/* the checkMatch function which checks if the elements children (from the list) have the same className "if yes then it calls 
 lockCards function" and "if no it calls hideCards function" and then clears the list and counts a move
*/
function checkMatch() {
	const first= openCards[0];
	const second= openCards[1];
	if(first.children[0].className===second.children[0].className) {
		incrementMoves();
		lockCards(first);
		lockCards(second);
		cardsMatched++;
		if(cardsMatched<8) {
		Swal.fire({
  position: 'top-end',
  title: 'Good move!',
  showConfirmButton: false,
  timer: 300
})}
	}
	else {
		incrementMoves();
        first.classList.add('unMatch');
        second.classList.add('unMatch');
        hideCards(first);
        hideCards(second);
        Swal.fire({
  position: 'top-start',
  title: 'Wrong move',
  showConfirmButton: false,
  timer: 300
})
	}
	openCards.splice(0);
}
// the LockCards function which adds the class (match) to the element
function lockCards(card) {
    card.classList.add('match');
    if(cardsMatched===7) {
        wonGame();
    }
}
// the hideCards function which removes the classes (open/show/disabled) from the element
function hideCards(card) {
 setTimeout(() => {
        card.classList.remove('open', 'show', 'disabled', 'unMatch');
    }, 500)
}
// the restartGame function which reassigns the variables + calls the stoptimer and resetStars and resetCards function
function restartGame() {
    openCards=[];
    cardsMatched=0;
    movesNumber=0;
    rating= 4;
    times=1;
    moves.innerHTML= movesNumber;
    Swal.fire({
  position: 'center',
  type: 'success',
  title: 'Game started',
  showConfirmButton: false,
  timer: 1000
})
    resetStars();
    resetCards();
}
// the wonGame function which displays a modal and calls freezetimer function
function wonGame() {
	Swal.fire({
  title: 'Nice Job!',
  text: 'You won in '+minutes+':'+seconds+' with '+movesNumber+' moves and '+rating+ 'stars',
  type: 'success',
  confirmButtonText: 'Play Again',
  footer: 'The Game will automatically restart after 10 seconds',
  confirmButtonClass: 'reloadPage',
})
	setTimeout(() => {
        location.reload(true);
    }, 10000)
	freezeTimer();
	document.querySelector('.reloadPage').addEventListener('click', function() {
		location.reload(true);
	})
}
// the incrementmoves function increments and displays the moves count + calls removeStars function
function incrementMoves() {
	movesNumber++;
    moves.innerHTML= movesNumber;
    removeStars();
}
// this function is obv from the name ... no need to talk about it :P
function removeStars() {
	if(movesNumber===15) {
    	rating--;
    	stars[3].classList.add("removed");
    }
    else if(movesNumber===20) {
    	rating--;
    	stars[2].classList.add("removed");
    }
    else if(movesNumber===24) {
    	rating--;
    	stars[1].classList.add("removed");
    }
}
// this function resets the stars (i mean it displays them again)
function resetStars() {
	stars[3].classList.remove("removed");
    stars[2].classList.remove("removed");
    stars[1].classList.remove("removed");
}
// the four next function are timer functions
function startTimer() {
	timer = setInterval(setTime, 1000);
}
function stopTimer() {
	clearInterval(timer);
	seconds= 0;
    minutes= 0;
    appendSeconds.innerHTML= "00";
    appendMinutes.innerHTML= "00";
}
function freezeTimer() {
    clearInterval(timer);
}
function setTime() {
	seconds++;
    if(seconds <= 9){
      appendSeconds.innerHTML = "0" + seconds;
    }    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
    if (seconds > 59) {
      minutes++;
      appendMinutes.innerHTML = "0" + minutes;
      seconds = 0;
      appendSeconds.innerHTML = "0" + 0;
    }
    if (minutes > 9){
      appendMinutes.innerHTML = minutes;
    }
}
