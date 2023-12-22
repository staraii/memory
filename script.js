    

/* -------------------------------- FRONT END MEMORY -----------------------------------------------------
Memory spel som följer de obligatoriska spelreglerna. Men då detta är ett frontend-memory går det ut på att matcha html-taggar, ett par består av en html-tags start- och sluttag.
Den spelare som samlar på sig start- och sluttaggarna för html, head, title och body får fem bonuspoäng då den har samlat på sig en "komplett hemsida".

I detta memory kan spelarna välja antal par dom vill spela med; 12, 16 eller 20 par.
Korten skapas genom att generera nya element i en loop vilket gör att det mycket enkelt kan utökas med andra antal par.
På samma sätt är high scoren skapad så att det mycket enkelt går att ändra både antal spelare/poäng som ska lagras men också visas. 
Nu lagrar och visar spelet de tre högsta poängen. Vid poäng som är lika med en tidigare tar den senaste poängen prioritet och flyttar ner den tidigare ett steg på listan. 
Bägge spelares resultat jämförs mot tidigare. 

*/

// --------------------------------- Deklaration av variabler. --------------------------------------------

// --- För att generera kort. --------
const tags = ['html', 'head', 'title', 'body', 'article', 'main', 'header', 'nav', 'p', 'h1', 'span', 'a', 'aside', 'b', 'button', 'ul', 'div', 'figure', 'footer', 'form'];
let numberOfPairs = 0;          // Antal par som ska genereras till spelplanen. Räknar också ner för hur många par som är kvar i spel. 

// --- Spelardata ----
let nameOne = "";
let nameTwo = "";
let scoreOne = 0;
let scoreTwo = 0;
let playerOneTags = [];         // Spelare etts samlade "html-tags".
let playerTwoTags = [];         // Spelare tvås tags. 

// --- Spelets state, logik, vända/matcha kort och turtagning. ---
let playerTurn = 0;             // Vems tur, 0-1 är spelare ett och 2-3 är spelare två.
let cardOne, cardTwo;           // De två kort som spelaren klickar på och som sedan jämförs om de matchar varandra och ger ett par. 
let awaitTurn = false;          // "Låser" spelplanen så att det inte går att vända nya kort innan tidigare kort har vänts tillbaka eller tagits ur spel om det var ett par.




// ---------------------------- Element ------------------------------

const gameMenu = document.querySelector('.game-menu');      // Första meny fönstret 

// Header/Scoreboard - Spelarnamn och poäng
const headerScoreBoard = document.querySelector('.header-score-board');
const playerNames = document.querySelectorAll('.player-names');
const playerScores = document.querySelectorAll('.player-scores');

// Spelplanen
const gameBoard = document.querySelector('.game-board');

// Container för resultat och high score vid spelets slut
const gameEnding = document.querySelector('.game-end');

// Element för att redovisa matchresultatet
const result = document.querySelector('.h1-game-result');
const h3ScoreOne = document.querySelector('.h3-game-result-1');
const h3ScoreTwo = document.querySelector('.h3-game-result-2');

// Element för att redovisa high score
const liNewHighScore = document.querySelector('.li-hs');
const spanHsPlayers = document.querySelectorAll('.span-hs-players');
const spanHsScores = document.querySelectorAll('.span-hs-scores');




// ------------------------- VAL AV SPELTYP -----------------------
// MAN VS MACHINE 
document.querySelector('.btn-machine').addEventListener('click', () => {
    alert("Error: Skynet is down for maintenance!");
});        


// 1 VS 1 
document.querySelector('.btn-1vs1').addEventListener('click', () => {
    document.querySelector('.game-menu-pick').classList.toggle('hide');
    document.querySelector('.game-menu-players').classList.toggle('hide');
});


// ----------------------------Startknapp -----------------------------------
document.querySelector('.btn-start-two-players').addEventListener('click', () => {      
    nameOne = document.querySelector('.input-player-1').value;  // Input för spelarnamn
    nameTwo = document.querySelector('.input-player-2').value;
  
    if(nameOne.length < 1 || nameTwo.length < 1){       // Kontroll av namninput     
        alert("Please enter player names!");
        return;
    }

    numberOfPairs = document.querySelector('input[type="radio"]:checked').value;    // Val av antal par    
    
    document.querySelector('.game-menu-players').classList.toggle('hide');          // Döljer spelmenyn.
    gameMenu.classList.toggle('hide');

    setScoreBoard();                        // Anrop till funktion för headern/scoreboard

    setGameBoard(numberOfPairs);            // Anrop till funktion för att ordna spelplanen. Valda antal par som argument.        
});



const resetButton = document.querySelector('.btn-reset').addEventListener('click', () => {      // Knapp för att starta om spelet, göra via att ladda om sidan.
    location.reload();
});




// -------------------------------------- FUNKTIONER ------------------------------------------------------

function setScoreBoard(){                                   
    headerScoreBoard.classList.toggle('hide');              // Visa header/scoreboard.
    updateScoreBoard();                                     // Anropar funktion som uppdaterar informationen på scoreboard. 
}


function setGameBoard(numberOfPairs) {                      // Ordnar spelplanen.

    gameBoard.classList.toggle('hide');                     // Visar spelplanen.
    
    generateCards(numberOfPairs);                           // Anropar funktion för att generera korten. Antal valda par som argument. 
    
    const cards = document.querySelectorAll('.card');       // Skapar lista av noder för alla korten.
    
    setCardClick(cards);                                    // Anropar funktion som ger alla kort en eventlistener. Nodlista som argument.
    
    shuffle(cards, numberOfPairs);                          // Anropar funktion för att blanda/positionera korten. Nodlista och antal valda par som argument. 
}



function generateCards(numberOfPairs) {                     // Skapar elementen och genererar innehåller till korten.

    const cardsFragment = document.createDocumentFragment();    // documentFragment där kort/element samlas innan det lyfts in i DOM:en.

    for(let i = 0; i < numberOfPairs; i++){                 // Loop för att generera kort, skapar ett kortpar per iteration.

        // Kort ett 
        const newCardOne = document.createElement('article');   // Genererar det första kortet i ett par.
        newCardOne.classList.add('card');                       // Tilldelar en klass till elementet.
    
        const attrTag = document.createAttribute('data-tag');   // Skapar ett data-attribute som används för match korten i paret.
        attrTag.value = tags[i];                                // Värdet hämtas från en lista(array).
        newCardOne.setAttributeNode(attrTag);                   // Kortet/elementet tilldelas attributet. 

        const newCardOneFront = document.createElement('figure');   // Element som blir kortets "framsida".
        newCardOneFront.classList.add('card-front', 'flipped');     // Tilldelar klassen .flipped så att framsidan kommer vara vänd neråt.
        
        const newTextNodeOne = document.createTextNode(`<${tags[i]}>`);
        newCardOneFront.appendChild(newTextNodeOne);                            // Textnoden tilldelas till "framsidan"
        
        const newCardOneBack = document.createElement('figure');    // Skapar element för kortets baksida.
        newCardOneBack.classList.add('card-back');                  // Tilldelar en klass
      
        newCardOne.append(newCardOneFront, newCardOneBack);         // Båda element/sidor läggs in(append) i kortelementet. 


        // Kort två
        const newCardTwo = document.createElement('article');       // Genererar det matchande kortet i paret efter samma princip.
        newCardTwo.classList.add('card');
        
        const attrTagTwo = document.createAttribute('data-tag');    // Tilldelar samma data-attribute för att kunna matcha korten.
        attrTagTwo.value = tags[i];
        newCardTwo.setAttributeNode(attrTagTwo);

        const newCardTwoFront = document.createElement('figure');
        newCardTwoFront.classList.add('card-front', 'flipped');
  
        const newTextNodeTwo = document.createTextNode(`</${tags[i]}>`);    // I detta kort skiljer sig textnodens innehåll då det ska motsvara html-tagens sluttag.
        newCardTwoFront.appendChild(newTextNodeTwo);

        const newCardTwoBack = document.createElement('figure');
        newCardTwoBack.classList.add('card-back');

        newCardTwo.append(newCardTwoFront, newCardTwoBack);

        cardsFragment.append(newCardOne, newCardTwo);   // För in båda korten i dokumentfragmentet. Append för att kunna ta båda korten samtidigt.
    }
    gameBoard.appendChild(cardsFragment);       // För in dokumentfragmentet i container-elementet för spelplanen.
}


function setCardClick(cards){       //  Funktion för att göra korten klickbara.
    cards.forEach(card => card.addEventListener('click', flipCard));    //Loopar igenom nodlista för alla korten och tilldelar var och en en eventlistener. 
}


function flipCard() {           // Funktion för att vända korten.
    
    if(awaitTurn === true){ // Stämmer villkoret avslutas funktionen utan att vända det senast klickade kortet för att det inte ska gå att vända flera kort medans ett kort vänds.
        return;
    
    } else if(this === cardOne){    // Är värdet av cardOne detsamma som det klickade kortet(du har klickat på ett redan vänt kort), avsluta funktionen.
        return;

    } else {        // Om de tidigare villkoren inte uppfyllts, tilldela det klickade kortet klassen .flipped så att kortet vänds.
        this.classList.add('flipped');
    }

    if(!cardOne){   // Om cardOne inte är definierad ska den få värdet av det klickade kortet. (Detta är det första kortet du klickat på)
        cardOne = this;
        return;
    }
    cardTwo = this; // Annars får cardTwo värdet av det klickade kortet. (Då var det här det andra kort du klickat på)
   
    awaitTurn = true; // Gör att det inte går att vända fler kort förrän kommande funktion har kontrollerat om korten är ett par. 
  
    matchCard();  
}


function flipCardBack() { // Vänder tillbaka de kort som ej är ett matchande par. 

    awaitTurn = true;   // Hindrar från att vända nya kort under tiden.

    setTimeout(() => {      // Fördröjning för att ge tid till kortvändningens animation.
        cardOne.classList.remove('flipped');
        cardTwo.classList.remove('flipped');
        resetGameBoard();
    }, 1500);
}




function matchCard() {      // Är korten ett par?
    
    if(cardOne.dataset.tag === cardTwo.dataset.tag) {   // Jämför de båda kortens data-attribute. Om dom matchar kontrollera vilken spelare som ska få poäng. 
       
        if(playerTurn <= 1){       // Avgör vilken spelares tur det är, vem som ska få poängen för paret. Detta är spelare etts första och andra drag.
            playerTurn++; 
            scoreOne++;
            playerOneTags.push(cardOne.dataset.tag);    // Från  kortets dataset samlas de vunna parens data i en lista.
            removeCards();                              // Anropar funktion för att ta bort korten ur spel. 
            return;
        } else if(playerTurn >= 2){    // Samma som ovan fast detta är spelare tvås första och andra drag.
            playerTurn++;
            scoreTwo++;
            playerTwoTags.push(cardOne.dataset.tag);
            removeCards();
            return;
        }
    
    } else if(playerTurn <= 1) {   // Ej ett par, korten matchade inte då övergår turen till spelare två och korten vänds tillbaka.  
        playerTurn = 2;
        flipCardBack();                                 // Anropar funktion för att vända tillbaka korten. 

    } else if(playerTurn >= 2){    // Samma som ovan fast vice versa. 
        playerTurn = 0;
        flipCardBack();
    }
}

function removeCards() {            // Tar bort funna par ur spel. 
  
    numberOfPairs--;                // Räknar ner antalet par som är kvar i spel. 
  
    cardOne.removeEventListener('click', flipCard());   // Tar bort kortens eventlistener, så att de ej går att vända igen. 
    cardTwo.removeEventListener('click', flipCard());
    resetGameBoard();               // Återställer spelets "state". 

    if(numberOfPairs == 0){         // Om antalet par kvar i spel är 0 då är spelet slut.
        setTimeout(() => {      // Fördröjning för att göra övergången från spelplanen till slutfönstret lite mjukare. 
            calcScore();                // Anropar funktion för att räkna samman poängen. 
            gameEnd();                  // Anropar funktion för att ta bort spelplanen och visa resultat. 
        }, 1500);  
    }
}


function resetGameBoard(){          // Återställer spelets state. 
    
    if(playerTurn > 3){             // Om det var spelare tvås tur och denne har spelat båda sina drag övergår turen till spelare ett.
        playerTurn = 0;
    }
    awaitTurn = false;              // Gör att korten återigen går att vända.
    
    cardOne = "";                   // Återställer de senaste vända korten. 
    cardTwo = "";
    
    updateScoreBoard();             // Anropar funktion för att uppdatera vems tur och poäng som visas på scoreboard. 
}



function updateScoreBoard() {       // Visar vems tur det är och aktuell poäng. 
    
    if(playerTurn <= 1){   // Spelare etts första eller andra drag. 
        playerNames[0].innerText = `${nameOne}'s turn!`;
        playerNames[1].innerText = nameTwo;
   
    } else {                                    // Spelare tvås tur.
        playerNames[1].innerText = `${nameTwo}'s turn!`;
        playerNames[0].innerText = nameOne;
    }
    
    playerScores[0].innerText = scoreOne;       // Uppdaterar poängen.
    playerScores[1].innerText = scoreTwo;
}



function shuffle(cards) {                   // Funktion som blandar/positionerar korten. 
    
    cards.forEach(card => {                 // Loopar igenom nodlista för alla kort. 
        
        let cardPosition = Math.floor(Math.random() * (cards.length));  // Random funktionen slumpar fram värdet till varje enskilt kort.
        
        card.style.order = cardPosition;    // Slumpvärdet tilldelas varje enskilt korts(elements) css egenskap "order:", vilket positionerar kortet då containern de ligger i är en flexbox.
    });
}

 
function calcScore(){                       // Funktion för att sammanställa poäng.
    
    // Kontrollerar om alla taggarna finns i spelare etts lista.
    if(playerOneTags.includes("html") && playerOneTags.includes("head") && playerOneTags.includes("body") && playerOneTags.includes("title")){

        scoreOne += 5;                      // Stämde villkoret, ges 5 extra poäng och en meddelande ruta visas. 
        alert(`${nameOne} got the tags for a full website. Congratulations, 5 extra points!`);
    
    // Samma som ovan fast för spelare två.
    } else if(playerTwoTags.includes("html") && playerTwoTags.includes("head") && playerTwoTags.includes("body") && playerTwoTags.includes("title")){
        scoreTwo += 5;
        alert(`${nameTwo} got the tags for a full website. Congratulations, 5 extra points!`);
    }
}



function checkHighScore(playerOne, scoreOne, playerTwo, scoreTwo){      // Funktion för att se om den aktuella poängen räcker för att ta sig in på highscoreen. 
    
    const ifHighScore = localStorage.getItem('localHsScores');          // Ger variabeln värdet från localStorage. 
    const checkHighScores = JSON.parse(localStorage.getItem('localHsScores'));

    if(!ifHighScore){     // Om variabeln saknar värde, fanns ingen tidigare sparad  highscore.
        const hsScores = [scoreOne, scoreTwo, 0];       // Array för poäng
        const hsPlayers = [playerOne, playerTwo, " - "];        //Array för spelarnamn                                
        localStorage.setItem('localHsScores', JSON.stringify(hsScores));     // Stringify gör om arrayn till stringformat för att kunna sparas i localStorage. 
        localStorage.setItem('localHsPlayers', JSON.stringify(hsPlayers));
        liNewHighScore.textContent = "New High Score!";                 // Skriver ut att en ny high score är satt. 
        spanHsPlayers[0].classList.add('highscore-marked');             // Lägger till en klass på de element som visar namn och poäng på de nya highscore.
        spanHsScores[0].classList.add('highscore-marked');
        spanHsPlayers[1].classList.add('highscore-marked');
        spanHsScores[1].classList.add('highscore-marked');
        updateHighScore(hsPlayers, hsScores);                           // Anropar funktion för att visa highscoren.
        return;

    } else {        // Om det finns en tidigare sparad highscore...
    
        let hsScores = checkHighScores.map(str => {     // Poängen hämtad från lS är i strängformat, för att kunna jämföra poängen görs den om till ett nummervärde. 
            return parseInt(str, 10);
        });
        let hsPlayers = JSON.parse(localStorage.getItem('localHsPlayers'));
        
        for(let i = 0; i < hsScores.length; i++){       // Jämför omgångens högsta poäng mot sparad highscore highscore. 
            if(scoreOne >= hsScores[i]){    // Högre eller lika med så kommer den aktuella spelaren/poängen ta platsen på HS, vid lika tar den senaste poängen platsen. 
                hsScores.splice(i, 0, scoreOne);    // Lägger in poängen på första index i arrayen. På detta sätt flyttas tidigare poäng ner på highscoren. 
                hsScores.splice((hsScores.length - 1), 1);              // Tar bort poängen på fjärde index i arrayen. Highscoren ska bara innehålla tre platser. 
                hsPlayers.splice(i, 0, playerOne);    // Samma som ovan fast i arrayen för namn.
                hsPlayers.splice((hsPlayers.length - 1), 1);
                liNewHighScore.textContent = "New High Score!";  // Skriver ut att en ny highscore är satt.
                spanHsPlayers[i].classList.add('highscore-marked'); // Tilldelar en klass som formaterar texten, för att markera de nya resultaten. 
                spanHsScores[i].classList.add('highscore-marked');
                
                    for(let j = (i + 1); j < hsScores.length; j++){ // Om omgångens högsta poäng var hög nog för HS, kollas även den andra poängen mot HS.
                        if(scoreTwo >= hsScores[j]){                // Samma som ovan fast här på index +1.
                            hsScores.splice(j, 0, scoreTwo);
                            hsScores.splice((hsScores.length - 1), 1);
                            hsPlayers.splice(j, 0, playerTwo);
                            hsPlayers.splice((hsPlayers.length - 1), 1);
                            spanHsPlayers[j].classList.add('highscore-marked');
                            spanHsScores[j].classList.add('highscore-marked');
                            updateHighScore(hsPlayers, hsScores);
                            return;
                        }
                    }
                updateHighScore(hsPlayers, hsScores);
                return;
            }
        }  
    }

}

function updateHighScore(hsPlayers, hsScores){
    for(let i = 0; i < hsScores.length; i++){       // Loop för att generera fram visningen av HS. 
        spanHsPlayers[i].textContent = `${i + 1}. ${hsPlayers[i]}`;     // Spelarnamn med numrering.
        spanHsScores[i].textContent = hsScores[i];                      // Poäng
    }
    localStorage.setItem('localHsPlayers', JSON.stringify(hsPlayers));      // Omvandlar arrayen till en sträng och sparar till localStorage. 
    localStorage.setItem('localHsScores', JSON.stringify(hsScores));        // Samma som ovan. 
    return;
}



function gameEnd(){     // Döljer spelplanen och visar ruta för matchresultat. 
    gameBoard.classList.add('hide');
    gameEnding.classList.remove('hide');
    whoWon();
}


function whoWon(){      // Genererar slutrutan med resultat. 
    if(scoreOne === scoreTwo){  // Om oavgjort. 

        result.textContent = "Game ended in a draw!";
        h3ScoreOne.textContent = `Both players got ${scoreOne} points`;
        checkHighScore(nameOne, scoreOne, nameTwo, scoreTwo);   // Vid oavgjort får spelare ett förtur, dennes poäng kommer hamna över spelare två i eventuell highscore. 

    } else if(scoreOne > scoreTwo){     // Om spelare ett vann

        result.innerText = `${nameOne} won!`;
        h3ScoreOne.textContent = `${nameOne} got ${scoreOne} points`;
        h3ScoreTwo.textContent = `${nameTwo} got ${scoreTwo} points`;
        
        checkHighScore(nameOne, scoreOne, nameTwo, scoreTwo);   // Kontrollera highscore, namn och poäng som argument, spelare etts(vinnaren) poäng först.

    } else if(scoreTwo > scoreOne) {    // Om spelare två vann.

        result.innerText = `${nameTwo} won!`;
        h3ScoreOne.textContent = `${nameTwo} got ${scoreTwo} points`;
        h3ScoreTwo.textContent = `${nameOne} got ${scoreOne} points`;

        checkHighScore(nameTwo, scoreTwo, nameOne, scoreOne);   // Samma som ovan men här spelare  tvås poäng först. 
    }

}



