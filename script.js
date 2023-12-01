
const gameBoard = document.querySelector('.game-board');
const gameEnding = document.querySelector('.game-end');
const tags = ['html', 'head', 'title', 'body', 'article', 'main', 'header', 'nav', 'p', 'h1', 'span', 'a', 'aside', 'b', 'button', 'ul', 'div', 'figure', 'footer', 'form'];
let nameOne = "";
let nameTwo = "";
const playerOneName = document.querySelector('.player-one-name');
const playerTwoName = document.querySelector('.player-two-name');
const gameMenu = document.querySelector('.game-menu');
const headerScoreBoard = document.querySelector('.header-score-board');

const playerWinDisplay = document.querySelector('.p-winner');
const playerLoserDisplay = document.querySelector('.p-loser');
const winningScoreDisplay = document.querySelector('.p-winner-score');
const losingScoreDisplay = document.querySelector('.p-loser-score');
const winnerHeading = document.querySelector('.h3-winner');
const restartButton = document.querySelector('.restart-game-button');


let numberOfPairs;

const playerOneScore = document.querySelector('.player-one-score');
const playerTwoScore = document.querySelector('.player-two-score');

let playerTurn = 0;
let playerOneTags = [];
let playerTwoTags = [];
let scoreOne = 0;
let scoreTwo = 0;


let cardOne, cardTwo;
let flippedFirstCard = false;
let awaitTurn = false;


// Val av speltyp
// 1 VS 1
document.querySelector('.btn-1vs1').addEventListener('click', () => {
    document.querySelector('.game-menu-pick').classList.toggle('hide');
    document.querySelector('.game-menu-players').classList.toggle('hide');
});


// MAN VS MACHINE
document.querySelector('.btn-machine').addEventListener('click', () => {
    alert("Error: Skynet is down for maintenance!");
});

// Input för spelarnas namn
document.querySelector('.btn-start-two-players').addEventListener('click', () => {
    nameOne = document.querySelector('.input-player-1').value;
    nameTwo = document.querySelector('.input-player-2').value;
    numberOfPairs = document.querySelector('input[type="radio"]:checked').value;
    document.querySelector('.game-menu-players').classList.toggle('hide');
    gameMenu.classList.toggle('hide');
    
    setScoreBoard();
    
    setGameBoard(numberOfPairs);
    
});

function setScoreBoard(){
    headerScoreBoard.classList.toggle('hide');
    updateScoreBoard();
}

function setGameBoard(numberOfPairs) {

    gameBoard.classList.toggle('hide');
    generateCards(numberOfPairs);
    const cards = document.querySelectorAll('.card');
    setCardClick(cards);
    shuffle(cards, numberOfPairs);
    
}



function generateCards(numberOfPairs) {

    const cardsFragment = document.createDocumentFragment();
    

    for(let i = 0; i < numberOfPairs; i++){

   
    
        //Generera det första kortet i ett par.
        const newCardOne = document.createElement('article');
        newCardOne.classList.add('card');
        const attrTag = document.createAttribute('data-tag');
        attrTag.value = tags[i];
        newCardOne.setAttributeNode(attrTag);
        const newCardOneFront = document.createElement('figure');
        newCardOneFront.classList.add('card-front', 'flipped');
        const newTextNodeOne = document.createTextNode("<" + tags[i] + ">");
        newCardOneFront.appendChild(newTextNodeOne);
        const newCardOneBack = document.createElement('figure');
        newCardOneBack.classList.add('card-back');
        newCardOne.append(newCardOneFront, newCardOneBack);


        //Generera det andra matchande kortet i paret.
        const newCardTwo = document.createElement('article');
        newCardTwo.classList.add('card');
        const attrTagTwo = document.createAttribute('data-tag');
        attrTagTwo.value = tags[i];
        newCardTwo.setAttributeNode(attrTagTwo);
        const newCardTwoFront = document.createElement('figure');
        newCardTwoFront.classList.add('card-front', 'flipped');
        const newTextNodeTwo = document.createTextNode("</" + tags[i] + ">");
        newCardTwoFront.appendChild(newTextNodeTwo);
        const newCardTwoBack = document.createElement('figure');
        newCardTwoBack.classList.add('card-back');
        newCardTwo.append(newCardTwoFront, newCardTwoBack);


        cardsFragment.append(newCardOne, newCardTwo);
    }


    gameBoard.appendChild(cardsFragment);

}

function setCardClick(cards){

    cards.forEach(card => card.addEventListener('click', flipCard));
}



function flipCard() {
    
    if(awaitTurn === true){
        return;
    } else if(this === cardOne){
        return;
    } else {
        this.classList.add('flipped');
    }

    if(!cardOne){
        cardOne = this;
        return;
    }
    
    cardTwo = this;
    awaitTurn = true;
    matchCard();
    
}

function flipCardBack() {
    awaitTurn = true;

    setTimeout(() => {
        cardOne.classList.remove('flipped');
        cardTwo.classList.remove('flipped');
        resetGameBoard();
    }, 1500);
}



function matchCard() {
    if(cardOne.dataset.tag === cardTwo.dataset.tag) {
        if(playerTurn === 0 || playerTurn === 1){
            playerTurn++;
            scoreOne++;
            playerOneTags.push(cardOne.dataset.tag);
            removeCards();
            return;
        } else if(playerTurn === 2 || playerTurn === 3){
            playerTurn++;
            scoreTwo++;
            playerTwoTags.push(cardOne.dataset.tag);
            removeCards();
            return;
        }
          
    } else if(playerTurn === 0 || playerTurn === 1) {
        playerTurn = 2;
        flipCardBack();

    } else if(playerTurn === 2 || playerTurn === 3){
        playerTurn = 0;
        flipCardBack();
    }
}

function removeCards() {
    numberOfPairs--;
    
    cardOne.removeEventListener('click', flipCard());
    cardTwo.removeEventListener('click', flipCard());
    resetGameBoard();
    
    if(numberOfPairs == 0){
        calcScore();
        gameEnd();
        
     
    }
}

function resetGameBoard(){
    if(playerTurn > 3){
        playerTurn = 0;
    }
    flippedFirstCard = false;
    awaitTurn = false;
    cardOne = "";
    cardTwo = "";
    updateScoreBoard();
}

function updateScoreBoard() {
    if(playerTurn === 0 || playerTurn === 1){
        playerOneName.innerText = `${nameOne}'s turn!`;
        playerTwoName.innerText = nameTwo;
    } else {
        playerTwoName.innerText = `${nameTwo}'s turn!`;
        playerOneName.innerText = nameOne;
    }
    playerOneScore.innerText = scoreOne;
    playerTwoScore.innerText = scoreTwo;
}


function shuffle(cards) {
    cards.forEach(card => {
        let cardPosition = Math.floor(Math.random() * (cards.length));
        card.style.order = cardPosition;
    });
}


function calcScore(){
    if(playerOneTags.includes("html") && playerOneTags.includes("head") && playerOneTags.includes("body") && playerOneTags.includes("title")){
        scoreOne += 5;
        alert(nameOne + " got the tags for a full website. Congratulations, 5 extra points!");
    } else if(playerTwoTags.includes("html") && playerTwoTags.includes("head") && playerTwoTags.includes("body") && playerTwoTags.includes("title")){
        scoreTwo += 5;
        alert(nameTwo + " got the tags for a full website. Congratulations, 5 extra points!");
    }
    
    
}

function whoWon(){
    let result = document.querySelector('.game-result-2');

    if(scoreOne == scoreTwo){
       result.innerText = "Game ended in draw!";
       
    } else if(scoreOne > scoreTwo){
       
        
    } else if(scoreTwo > scoreOne) {
       
        
    }
}

function gameEnd(){
        
    
    gameBoard.classList.add('hide');
    gameEnding.classList.remove('hide');

    whoWon();
    
}








