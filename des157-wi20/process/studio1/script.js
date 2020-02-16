

(function(){


    "use strict"

    const num_blanks = 14; 
    let blanks = [];

    // action to take upon submission
    document.addEventListener("submit", function(event){

        event.preventDefault();

        // put all of the inputs in the blanks array
        for(let i = 0; i < num_blanks; i++) {
            blanks[i] = document.getElementById(`blank${i+1}`).value;
        }

        fillInBlanks(blanks);
        revealStory();
    });

    // fills in the blanks of the story with the words from the blanks array
    function fillInBlanks(blanks) {
        for(let i = 0; i < blanks.length; i++) {
            let blank = document.getElementById(`${i+1}`);
            blank.innerHTML = blanks[i];
        }
    }

    // toggles visibility on the story and the instructions
    function revealStory() {
        document.getElementById("story").removeAttribute("class"); // show story
        document.getElementById("instructions").setAttribute("class", "hidden"); // hide instructions
    }


}());