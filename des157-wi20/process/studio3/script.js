(function(){

    "use strict"

    
     // areas
     var gameArea = document.getElementById("game");
     var p1deckArea = document.getElementById("p1deckarea");
     var p2deckArea = document.getElementById("p2deckarea");
     var playedcardsArea = document.getElementById("playedcardsarea");
     var msgArea = document.getElementById("message");

     // buttons
     var p1play = document.getElementById("p1play");
     var p2play = document.getElementById("p2play");
     var start = document.getElementById("start");
     var next = document.getElementById("next");

     // images
     var p1Card = document.getElementById("p1");
     var warCards = document.getElementById("war")
     var p2Card = document.getElementById("p2");


     var game = {
         player1: {
             numCards: 0,
             cardArray: [],
         },
         player2: {
             numCards: 0,
             cardArray: [],
         },
         pile1: [],
         pile2: []
     };


     // start the game
     start.addEventListener("click", function(){
         // clear message area
         msgArea.innerHTML = "";
         
         // deal cards
         fillAndShuffle();
         // console.log(game.player1.cardArray);
         // console.log(game.player2.cardArray);
         // set up buttons
         start.innerHTML = "Restart Game";
         // p1play.setAttribute("class", "show");
         // p2play.setAttribute("class", "show");
         next.setAttribute("class", "show");
         next.disabled = false;
         // reset played card display
         p1Card.src = `images/blankspace.svg`;
         p2Card.src = `images/blankspace.svg`;
         

     });

     function fillAndShuffle(){
         const array = [];
         const SIZE = 52;
         // fill with 52 cards
         for (let i = 0; i < SIZE; i++) {
             array[i] = i+1;
         }
         // 52 random swaps
         for (let i = 0; i < SIZE; i++) {
             const rand = Math.ceil(Math.random()*SIZE);
             const temp = array[i];
             array[i] = array[rand];
             array[rand] = temp;
         }
         // partition to players
         for (let i=0; i<SIZE/2; i++) {
             game.player1.cardArray[i] = array[i];
             game.player2.cardArray[i] = array[i+SIZE/2];
         }
         game.player1.numCards = SIZE/2;
         game.player2.numCards = SIZE/2;

         document.getElementById("p1num").innerHTML = `${game.player1.numCards}`;
         document.getElementById("p2num").innerHTML = `${game.player2.numCards}`;
     }

     function isGameOver() {
         return game.player1.cardArray.length == 0 || game.player2.cardArray.length == 0;
     }
     function getWinner() {
         return game.player1.cardArray.length == 0 ? 2 : 1;
     }

     function evaluate() {
         msgArea.innerHTML = "";
         const card1val = cardNumToRank(game.pile1[game.pile1.length-1]);
         const card2val = cardNumToRank(game.pile2[game.pile2.length-1]);
         
         console.log("p1 " + card1val);
         console.log("p2 " + card2val);

         if (card1val < card2val) {
             msgArea.innerHTML += "<p>player two wins this round!</p>";
             for (let i = 0; i < game.pile1.length; i++) {
                 game.player2.cardArray.unshift(game.pile1.pop());
                 game.player2.numCards++;
             }
             for (let i = 0; i < game.pile2.length; i++) {
                 game.player2.cardArray.unshift(game.pile2.pop());
                 game.player2.numCards++;
             }
             console.log("to p2");
         }
         else if (card1val > card2val) {
             msgArea.innerHTML += "<p>player one wins this round!</p>";
             for (let i = 0; i < game.pile1.length; i++) {
                 game.player1.cardArray.unshift(game.pile1.pop());
                 game.player1.numCards++;
             }
             for (let i = 0; i < game.pile2.length; i++) {
                 game.player1.cardArray.unshift(game.pile2.pop());
                 game.player1.numCards++;
             }
             console.log("to p1");
         }
         // war scenario
         else {
             msgArea.innerHTML += "<p>THIS MEANS WAR!</p>"
             console.log("equal");
             setTimeout(function(){
                 moveCardP1War();
                 moveCardP2War();
                 playCardNoShow(game.player1);
                 playCardNoShow(game.player2);

                 // play faceup cards
                 setTimeout(function(){
                     moveCardP1();
                     moveCardP2();
                     playCardAndShow(game.player1);
                     playCardAndShow(game.player2);
                     evaluate();
                 }, 500);
                 
                 
             
             }, 1000);
             
         }
         document.getElementById("p1num").innerHTML = `${game.player1.numCards}`;
         document.getElementById("p2num").innerHTML = `${game.player2.numCards}`;
         console.log(game.player1.numCards);
         console.log(game.player2.numCards);

        setTimeout(function(){
            if (isGameOver()) {
                const winner = getWinner();
                msgArea.innerHTML = `<p>Player ${winner} won!</p>`;
                flashBorder(msgArea);
                start.innerHTML = "Play Again?";
             }
        }, 1000);
         

     }


     function moveCardP1() {
         p1deckArea.innerHTML += '<img src="images/cardback.svg" id="animatethis1" class="trans" width="225" height="300">';
         document.getElementById("animatethis1").style.left = "237px";
         setTimeout(function(){
             p1deckArea.removeChild(document.getElementById("animatethis1"));
         }, 500);
     }
     function moveCardP2() {
         p2deckArea.innerHTML += '<img src="images/cardback.svg" id="animatethis2" class="trans" width="225" height="300">';
         document.getElementById("animatethis2").style.transition = "none";
         document.getElementById("animatethis2").style.left = "0px";
         document.getElementById("animatethis2").style.transition = "all 0.5s";
         document.getElementById("animatethis2").style.left = "-238px";
         setTimeout(function(){
             p2deckArea.removeChild(document.getElementById("animatethis2"));
         }, 500);
     }
     function moveCardP1War() {
         p1deckArea.innerHTML += '<img src="images/cardback.svg" id="animatethis11" class="trans" width="225" height="300">';
         document.getElementById("animatethis11").style.top = "-8px";
         document.getElementById("animatethis11").style.left = "375px";
         setTimeout(function(){
             p1deckArea.removeChild(document.getElementById("animatethis11"));
         }, 500);
     }
     function moveCardP2War() {
         p2deckArea.innerHTML += '<img src="images/cardback.svg" id="animatethis22" class="trans" width="225" height="300">';
         document.getElementById("animatethis22").style.top = "-8px";
         document.getElementById("animatethis22").style.left = "-375px";
         setTimeout(function(){
             p2deckArea.removeChild(document.getElementById("animatethis22"));
         }, 500);
     }

     function playCardAndShow(player) {
         
         // console.log(player.cardArray);
         let topCard = player.cardArray.pop();
         // console.log(topCard);

         if (player == game.player1) {
             game.pile1.push(topCard);
             if (topCard < 10) {topCard = `0${topCard}`;}
             console.log(topCard);
             p1Card.src = `images/cards-${topCard}.svg`;
         }
         else {
             game.pile2.push(topCard);
             if (topCard < 10) {topCard = `0${topCard}`;}
             p2Card.src = `images/cards-${topCard}.svg`;
         }
         player.numCards--;
     }

     function playCardNoShow(player) {

         let topCard = player.cardArray.pop();

         if (player == game.player1) {
             game.pile1.push(topCard);
         }
         else {
             game.pile2.push(topCard);
         }
         player.numCards--;
     }
     
     next.addEventListener('click', function(){
         nextRound();
     });

     function nextRound() {
         next.disabled = true;
         if (!isGameOver()){
             moveCardP1();
             moveCardP2();
             playCardAndShow(game.player1);
             playCardAndShow(game.player2);

             evaluate();
             setTimeout(function(){
                 next.disabled = false;
             }, 1000);
         }

        //  document.getElementById("p1num").innerHTML = `${game.player1.numCards}`;
        //  document.getElementById("p2num").innerHTML = `${game.player2.numCards}`;

        //  if (isGameOver()) {
        //     const winner = getWinner();
        //     msgArea.innerHTML = `<p>Player ${winner} won!</p>`;
        //     flashBorder(msgArea);
        //     start.innerHTML = "Play Again?";
        //  }
     }


     function cardNumToRank(num) {
         while (num > 13) {
             num -= 13;
         }
         return num;
     }

     document.getElementById("collapse").addEventListener('click', function(){
         const article = document.querySelector("article");
         article.setAttribute("class", "hide");
     });

    function flashBorder(el) {
        let interval1 = setInterval(function(){
            el.style.backgroundColor = "red";
        }, 500);
        let interval2 = setInterval(function(){
            el.style.backgroundColor = "transparent";
        }, 1000);
        setTimeout(function(){
            clearInterval(interval1);
            clearInterval(interval2);
        }, 3000);
    }

    
    
}())