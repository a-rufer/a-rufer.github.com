

"use strict"

const num_blanks = 14;
var blanks = [];

document.addEventListener("submit", function(event){
    event.preventDefault();
    for(let i = 0; i < num_blanks; i++) {
        blanks[i] = document.getElementById(`blank${i+1}`).value;
    }
    fillInBlanks(blanks);
});

function fillInBlanks(blanks) {
    for(let i = 0; i < blanks.length; i++) {
        let blank = document.getElementById(`${i+1}`);
        blank.innerHTML = blanks[i];
    }
}